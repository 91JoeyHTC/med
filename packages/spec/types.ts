// 藥輪共用型別（single source of truth）
// 對應 medicine-wheel-spec.json 結構與《工程開發文件》§3 領域模型。

export type Layer = 'center' | 'sky' | 'family' | 'direction' | 'moon' | 'path';
export type Element = '火' | '土' | '風' | '水';
export type Family = '雷鳥' | '海龜' | '蝴蝶' | '青蛙';
export type Dir = '北' | '東' | '南' | '西';
export type GuardianDir = '天' | '地' | '北' | '東' | '南' | '西';

export interface Geometry {
  CX: number;
  CY: number;
  R_SAT: number;
  R_PATH: [number, number, number];
  R_OUTER: number;
  NODE: number;
  DIRNODE: number;
  centerAngles: Record<string, number>;
  pathDir: Record<Dir, number>;
  perim: Array<
    | { k: number; type: 'dir'; dir: Dir }
    | { k: number; type: 'month'; id: number }
  >;
}

export interface Moon {
  id: number;
  name: string;
  dir: Dir;
  season: string;
  zodiac: string;
  element: Element;
  family: Family;
  northAnimal: string;
  twAnimal: string;
  dateRange: [number, number, number, number]; // [m0,d0,m1,d1]
}

export interface PathEntry {
  dir: Dir;
  name: string;
  gloss: string;
}

export interface DirectionEntry {
  id: number;
  elem: Element;
  season: string;
}

export interface KnowledgeEntry {
  title: string;
  tags: string[];
  html: string;
}

export interface Spec {
  version: string;
  generatedFrom: string;
  note: string;
  geometry: Geometry;
  colors: Record<string, string>;
  elements: Record<Element, { family: Family; color: string }>;
  familyOfElement: Record<Element, Family>;
  elementOfFamily: Record<Family, Element>;
  familyNode: Record<Family, number>;
  dirNode: Record<Dir, number>;
  opposite: Record<Family, Family>;
  guardianDirs: GuardianDir[];
  directions: Record<Dir, DirectionEntry>;
  satellites: Record<string, { name: string; group?: string; elem?: Element }>;
  moons: Moon[];
  paths: Record<string, PathEntry>;
  positionNames: Record<string, string>;
  knowledge: Record<string, KnowledgeEntry>;
  general: Record<string, string>;
}

// ── 計算領域型別 ──
export interface Natal {
  id: number;          // 本命月份 id (13..24)
  fullmonth: string;
  dir: Dir;
  fam: Family;
  elem: Element;
  zod: string;
  famId: number;       // 5..8
  dirId: number;       // 9..12
}

export interface FamilyBalance {
  雷鳥: number;
  海龜: number;
  蝴蝶: number;
  青蛙: number;
  dominant: Family[];
  absent: Family[];
}

export interface Relation {
  type: '同族' | '雙合（對立）' | '半合（相鄰）';
  desc: string;
}

export interface Guardian {
  dir: GuardianDir;
  name: string;
  positions: number[];
}

export interface PersonChart {
  nickname: string;
  birth: { month: number; day: number };
  natal: Natal | null;
  guardians: Guardian[];
}
