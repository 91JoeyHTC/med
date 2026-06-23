// 盤面幾何：極座標換算與各層節點座標／半徑。對齊《工程開發文件》§4.4 與原型。
import { spec } from './spec';
import type { Dir } from './types';

const G = spec.geometry;
export const CX = G.CX;
export const CY = G.CY;
export const R_SAT = G.R_SAT;
export const R_PATH = G.R_PATH;
export const R_OUTER = G.R_OUTER;
export const NODE = G.NODE;
export const DIRNODE = G.DIRNODE;
export const CENTERANG = G.centerAngles;
export const PATHDIR = G.pathDir;
export const PERIM = G.perim;

// 路徑 id → 方位（25..36）
export const PATHS: Record<string, Dir> = Object.fromEntries(
  Object.entries(spec.paths).map(([id, p]) => [id, p.dir])
) as Record<string, Dir>;

// 12 點鐘為 0°、順時針。x = CX + r·cos(a−90°)
export function pol(a: number, r: number): [number, number] {
  const t = ((a - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(t), CY + r * Math.sin(t)];
}

export function pAng(k: number): number {
  return k * 22.5;
}

// 壓暗：家族衛星填色＝元素色 ×factor
export function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.round(r * f);
  g = Math.round(g * f);
  b = Math.round(b * f);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// 路徑在同方位輻條上的索引（編號由外向內，號碼小在外）
export function pathIdx(id: number | string): number {
  const d = PATHS[String(id)];
  const ids = Object.keys(PATHS)
    .filter((k) => PATHS[k] === d)
    .map(Number)
    .sort((a, b) => a - b);
  return ids.indexOf(Number(id));
}

function dirIdOf(dir: Dir): number {
  return spec.directions[dir].id;
}

export function angleOfId(id: number): number {
  const m = PERIM.find((p) => p.type === 'month' && (p as { id: number }).id === id);
  if (m) return pAng(m.k);
  const d = PERIM.find((p) => p.type === 'dir' && dirIdOf((p as { dir: Dir }).dir) === id);
  if (d) return pAng(d.k);
  return 0;
}

type Coord = [number, number, 'center' | 'node'];

export function posCoord(rawId: number | string): Coord {
  const id = String(rawId);
  if (id === '1') return [0, 0, 'center'];
  if (CENTERANG[id] != null) return [CENTERANG[id], R_SAT, 'node'];
  if (['9', '10', '11', '12'].includes(id)) return [angleOfId(+id), R_OUTER, 'node'];
  if (spec.moons.some((m) => m.id === +id)) return [angleOfId(+id), R_OUTER, 'node'];
  if (PATHS[id] != null) return [PATHDIR[PATHS[id]], R_PATH[pathIdx(id)], 'node'];
  return [0, R_OUTER, 'node'];
}

export function nodeR(rawId: number | string): number {
  const id = +rawId;
  if (id === 1) return 19;
  if (id <= 8) return 17;
  if (id <= 12) return 25;
  if (id <= 24) return 23;
  return 15;
}

export function nodeXY(id: number | string): [number, number] {
  const c = posCoord(String(id));
  if (c[2] === 'center') return [CX, CY];
  return pol(c[0], c[1]);
}
