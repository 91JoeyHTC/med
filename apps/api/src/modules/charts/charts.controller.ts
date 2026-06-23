import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { EngineService } from '../../engine/engine.service';
import { ChartsService, Chart } from './charts.service';

type Req = { user: { id: string } };

// 我的盤需登入；以 owner_id 隔離（對應 Supabase RLS）。
@Controller('charts')
@UseGuards(SupabaseAuthGuard)
export class ChartsController {
  constructor(
    private readonly charts: ChartsService,
    private readonly engine: EngineService,
  ) {}

  @Get()
  list(@Req() req: Req) {
    return this.charts.list(req.user.id);
  }

  @Post()
  create(@Req() req: Req, @Body() body: Omit<Chart, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) {
    return this.charts.create(req.user.id, body);
  }

  @Get(':id')
  get(@Req() req: Req, @Param('id') id: string) {
    return this.charts.get(req.user.id, id);
  }

  @Put(':id')
  update(@Req() req: Req, @Param('id') id: string, @Body() body: Partial<Chart>) {
    return this.charts.update(req.user.id, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req: Req, @Param('id') id: string) {
    this.charts.remove(req.user.id, id);
  }

  // POST /api/charts/:id/report → {rule, ai}（R2，轉呼 engine）
  @Post(':id/report')
  report(@Req() req: Req, @Param('id') id: string) {
    const chart = this.charts.get(req.user.id, id);
    return this.engine.report(chart);
  }

  // POST /api/charts/:id/export → {url}（R3，骨架）
  @Post(':id/export')
  export(@Req() req: Req, @Param('id') id: string) {
    const chart = this.charts.get(req.user.id, id);
    // TODO(R3): 後端渲染盤面 → 上傳 Supabase Storage → 回傳簽章 URL。
    return { url: null, note: `匯出尚未實作（chart ${chart.id}）` };
  }
}
