import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EngineService } from '../../engine/engine.service';
import { AnalyzeDto, NatalDto } from './dto';

// 單一真理：直接讀 packages/spec（與引擎同檔）。
const SPEC_PATH = join(__dirname, '../../../../../packages/spec/medicine-wheel-spec.json');
const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf-8'));

@Controller()
export class AnalysisController {
  constructor(private readonly engine: EngineService) {}

  // GET /api/spec → spec.json
  @Get('spec')
  getSpec() {
    return spec;
  }

  // GET /api/knowledge/:id → {id, entry}
  @Get('knowledge/:id')
  getKnowledge(@Param('id') id: string) {
    const entry = spec.knowledge[id] ?? (spec.paths[id] ? spec.knowledge.path : undefined);
    if (!entry) throw new NotFoundException(`無此位置知識卡：${id}`);
    return { id, entry };
  }

  // POST /api/compute/natal → Natal（轉呼 engine）
  @Post('compute/natal')
  computeNatal(@Body() body: NatalDto) {
    return this.engine.natal(body.month, body.day);
  }

  // POST /api/compute/analyze → {balance, relation?}（轉呼 engine）
  @Post('compute/analyze')
  async computeAnalyze(@Body() body: AnalyzeDto) {
    const collect = (p: AnalyzeDto['people'][number]) => {
      const ids: number[] = [];
      const natal = p.natal as { id?: number } | undefined;
      if (natal?.id) ids.push(natal.id);
      (p.guardians ?? []).forEach((g) => g.animal && ids.push(...g.positions));
      return ids;
    };
    const balance = await Promise.all(body.people.map((p) => this.engine.balance(collect(p))));
    let relation: unknown;
    if (body.type === 'composite' && body.people.length >= 2) {
      const a = body.people[0].natal as { fam?: string } | undefined;
      const b = body.people[1].natal as { fam?: string } | undefined;
      if (a?.fam && b?.fam) relation = await this.engine.relate(a.fam, b.fam);
    }
    return { balance, relation };
  }
}
