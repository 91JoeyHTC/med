import { Injectable, InternalServerErrorException } from '@nestjs/common';

/**
 * Python 計算引擎（FastAPI）的 HTTP 客戶端。
 * NestJS 為 BFF：/compute/* 轉呼 engine（內部 POST engine:8000/...）。
 */
@Injectable()
export class EngineService {
  private readonly base = process.env.ENGINE_URL ?? 'http://localhost:8000';

  private async call<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new InternalServerErrorException(`engine ${path} failed: ${res.status}`);
    }
    return (await res.json()) as T;
  }

  natal(month: number, day: number) {
    return this.call('/natal', { month, day });
  }

  balance(positions: number[]) {
    return this.call('/balance', { positions });
  }

  relate(a: string, b: string) {
    return this.call('/relate', { a, b });
  }

  report(chart: unknown) {
    return this.call('/report', { chart });
  }

  async spec() {
    const res = await fetch(`${this.base}/spec`);
    if (!res.ok) throw new InternalServerErrorException('engine /spec failed');
    return res.json();
  }
}
