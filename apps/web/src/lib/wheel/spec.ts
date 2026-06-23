// 載入單一真理規格（由 scripts/sync-spec.mjs 從 packages/spec 複製而來）。
import specJson from '../../data/spec.json';
import type { Dir, Element, Family, Moon } from './types';

export interface PathEntry { dir: Dir; name: string; gloss: string }
export interface KnowledgeEntry { title: string; tags: string[]; html: string }

export interface Spec {
  version: string;
  geometry: {
    CX: number; CY: number; R_SAT: number; R_PATH: [number, number, number];
    R_OUTER: number; NODE: number; DIRNODE: number;
    centerAngles: Record<string, number>;
    pathDir: Record<Dir, number>;
    perim: Array<{ k: number; type: 'dir'; dir: Dir } | { k: number; type: 'month'; id: number }>;
  };
  colors: Record<string, string>;
  elements: Record<Element, { family: Family; color: string }>;
  familyOfElement: Record<Element, Family>;
  elementOfFamily: Record<Family, Element>;
  familyNode: Record<Family, number>;
  dirNode: Record<Dir, number>;
  opposite: Record<Family, Family>;
  guardianDirs: ('天' | '地' | '北' | '東' | '南' | '西')[];
  directions: Record<Dir, { id: number; elem: Element; season: string }>;
  satellites: Record<string, { name: string; group?: string; elem?: Element }>;
  moons: Moon[];
  paths: Record<string, PathEntry>;
  positionNames: Record<string, string>;
  knowledge: Record<string, KnowledgeEntry>;
  general: Record<string, string>;
}

export const spec = specJson as unknown as Spec;

// 位置名稱對照（1–12 固定 + 月份 + 路徑）
export const POS: Record<number, string> = (() => {
  const m: Record<number, string> = {};
  Object.entries(spec.positionNames).forEach(([k, v]) => (m[+k] = v));
  spec.moons.forEach((mo) => (m[mo.id] = mo.name.replace('之月', '')));
  Object.entries(spec.paths).forEach(([id, p]) => (m[+id] = p.name));
  return m;
})();

export default spec;
