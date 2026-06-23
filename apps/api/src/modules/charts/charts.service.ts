import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface Chart {
  id: string;
  ownerId: string;
  type: 'personal' | 'composite';
  title?: string;
  people: unknown[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 盤面 CRUD。
 *
 * 骨架：以記憶體 Map 暫存，提供完整 CRUD 介面。
 * 正式串接改用 Supabase（charts / chart_people / chart_guardians，RLS by owner_id）。
 * 介面刻意與 Supabase row 對齊，替換時僅換實作。
 */
@Injectable()
export class ChartsService {
  private store = new Map<string, Chart>();

  list(ownerId: string): Chart[] {
    return [...this.store.values()].filter((c) => c.ownerId === ownerId);
  }

  get(ownerId: string, id: string): Chart {
    const c = this.store.get(id);
    if (!c || c.ownerId !== ownerId) throw new NotFoundException('找不到盤面');
    return c;
  }

  create(ownerId: string, data: Omit<Chart, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>): Chart {
    const now = new Date().toISOString();
    const chart: Chart = { ...data, id: randomUUID(), ownerId, createdAt: now, updatedAt: now };
    this.store.set(chart.id, chart);
    return chart;
  }

  update(ownerId: string, id: string, data: Partial<Chart>): Chart {
    const existing = this.get(ownerId, id);
    const updated: Chart = { ...existing, ...data, id, ownerId, updatedAt: new Date().toISOString() };
    this.store.set(id, updated);
    return updated;
  }

  remove(ownerId: string, id: string): void {
    this.get(ownerId, id);
    this.store.delete(id);
  }
}
