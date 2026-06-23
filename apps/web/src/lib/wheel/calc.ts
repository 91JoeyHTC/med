// 核心演算法（與 Python 引擎同邏輯、同 spec）：生日→本命、家族平衡、相合、落點解析。
// 對齊《工程開發文件》§4。
import { spec, POS } from './spec';
import type { Element, Family, Natal, FamilyBalance, Person } from './types';

const ELEM = spec.elements;
const FAMID = spec.familyNode;
const DIRID = spec.dirNode;
const OPP = spec.opposite;

// 生日 → 本命月份（含跨年區間，如 12/22–1/19）
export function natalMonth(month: number, day: number) {
  return spec.moons.find((x) => {
    const [m0, d0, m1, d1] = x.dateRange;
    const after = month > m0 || (month === m0 && day >= d0);
    const before = month < m1 || (month === m1 && day <= d1);
    return m0 <= m1 ? after && before : after || before;
  });
}

export function calcNatal(month: number, day: number): Natal | null {
  const m = natalMonth(month, day);
  if (!m) return null;
  const fam = ELEM[m.element].family;
  return {
    id: m.id,
    fullmonth: m.name,
    dir: m.dir,
    fam,
    elem: m.element,
    zod: m.zodiac,
    famId: FAMID[fam],
    dirId: DIRID[m.dir],
  };
}

const SAT_FAMILY: Record<string, Family> = { '5': '海龜', '6': '青蛙', '7': '雷鳥', '8': '蝴蝶' };

// 位置 → 家族（月亮→元素→家族；家族節點 5–8→自身；其餘 null）
export function famOfPos(id: number): Family | null {
  const m = spec.moons.find((x) => x.id === id);
  if (m) return ELEM[m.element].family;
  if (SAT_FAMILY[String(id)]) return SAT_FAMILY[String(id)];
  return null;
}

// 落點字串解析：分隔符 [,，、空白]，僅接受存在於 spec 的 1..36
export function parsePos(s: string): number[] {
  return (s || '')
    .split(/[,，、\s]+/)
    .map((x) => parseInt(x, 10))
    .filter((n) => !Number.isNaN(n) && POS[n] != null);
}

// 家族平衡：本命 monthId + 所有守護靈落點 → 四家族計數 + 主導/缺席
export function famCounts(person: Person): FamilyBalance {
  const c: Record<Family, number> = { 雷鳥: 0, 海龜: 0, 蝴蝶: 0, 青蛙: 0 };
  const all: number[] = [];
  if (person.natal) all.push(person.natal.id);
  person.g.forEach((g) => {
    if (g.name) parsePos(g.posStr).forEach((id) => all.push(id));
  });
  all.forEach((id) => {
    const f = famOfPos(id);
    if (f) c[f]++;
  });
  const max = Math.max(...Object.values(c));
  const dominant = (Object.keys(c) as Family[]).filter((k) => c[k] === max && max > 0);
  const absent = (Object.keys(c) as Family[]).filter((k) => c[k] === 0);
  return { ...c, dominant, absent };
}

export interface Relation {
  type: '同族' | '雙合（對立）' | '半合（相鄰）';
  desc: string;
}

// 相合判定（A、B 本命家族）。藥輪不採二元對立、無嚴格不合。
export function relate(a: Family, b: Family): Relation {
  if (a === b) return { type: '同族', desc: '天生理解，能量加乘。' };
  if (OPP[a] === b)
    return {
      type: '雙合（對立）',
      desc: '互補極強，張力也大——元素相反（火↔風 或 土↔水）。',
    };
  return { type: '半合（相鄰）', desc: '有共同語言，需磨合。' };
}

export function elementColor(elem: Element): string {
  return ELEM[elem].color;
}
