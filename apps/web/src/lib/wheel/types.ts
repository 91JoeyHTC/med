// 前端領域型別。與 packages/spec/types.ts 對齊（前端載入 src/data/spec.json 之拷貝）。
export type Element = '火' | '土' | '風' | '水';
export type Family = '雷鳥' | '海龜' | '蝴蝶' | '青蛙';
export type Dir = '北' | '東' | '南' | '西';
export type GuardianDir = '天' | '地' | '北' | '東' | '南' | '西';
export type Mode = 'know' | 'draw';
export type Who = 'A' | 'B';

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
  dateRange: [number, number, number, number];
}

export interface Natal {
  id: number;
  fullmonth: string;
  dir: Dir;
  fam: Family;
  elem: Element;
  zod: string;
  famId: number;
  dirId: number;
}

export interface FamilyBalance {
  雷鳥: number;
  海龜: number;
  蝴蝶: number;
  青蛙: number;
  dominant: Family[];
  absent: Family[];
}

export interface Guardian {
  dir: GuardianDir;
  name: string;
  posStr: string;
}

export interface Person {
  name: string;
  bMon: string;
  bDay: string;
  natal: Natal | null;
  g: Guardian[];
}
