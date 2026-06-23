"""藥輪計算引擎（真理來源）：生日→本命、家族平衡、相合。

純函式、無狀態；以 spec 為輸入資料。與前端 lib/wheel 同邏輯、同 spec。
對齊《工程開發文件》§4 與 §8。
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional, TypedDict

from .spec import load_spec, position_names

_SPLIT = re.compile(r"[,，、\s]+")


class Natal(TypedDict):
    id: int
    fullmonth: str
    dir: str
    fam: str
    elem: str
    zod: str
    famId: int
    dirId: int


class FamilyBalance(TypedDict):
    雷鳥: int
    海龜: int
    蝴蝶: int
    青蛙: int
    dominant: List[str]
    absent: List[str]


class Relation(TypedDict):
    type: str
    desc: str


def natal_month(month: int, day: int) -> Optional[dict]:
    """生日 → 本命月份（含跨年區間，如 12/22–1/19）。"""
    for m in load_spec()["moons"]:
        m0, d0, m1, d1 = m["dateRange"]
        after = month > m0 or (month == m0 and day >= d0)
        before = month < m1 or (month == m1 and day <= d1)
        ok = (after and before) if m0 <= m1 else (after or before)
        if ok:
            return m
    return None


def calc_natal(month: int, day: int) -> Optional[Natal]:
    spec = load_spec()
    m = natal_month(month, day)
    if m is None:
        return None
    fam = spec["elements"][m["element"]]["family"]
    return Natal(
        id=m["id"],
        fullmonth=m["name"],
        dir=m["dir"],
        fam=fam,
        elem=m["element"],
        zod=m["zodiac"],
        famId=spec["familyNode"][fam],
        dirId=spec["dirNode"][m["dir"]],
    )


_SAT_FAMILY = {5: "海龜", 6: "青蛙", 7: "雷鳥", 8: "蝴蝶"}


def family_of_pos(pos_id: int) -> Optional[str]:
    """位置 → 家族（月亮→元素→家族；5–8→自身；其餘 None）。"""
    spec = load_spec()
    for m in spec["moons"]:
        if m["id"] == pos_id:
            return spec["elements"][m["element"]]["family"]
    return _SAT_FAMILY.get(pos_id)


def parse_positions(s: str) -> List[int]:
    """落點字串解析：分隔符 [,，、空白]，僅接受存在於 spec 的 1..36。"""
    names = position_names()
    out: List[int] = []
    for tok in _SPLIT.split(s or ""):
        if not tok:
            continue
        try:
            n = int(tok)
        except ValueError:
            continue
        if n in names:
            out.append(n)
    return out


def family_balance(positions: List[int]) -> FamilyBalance:
    """家族平衡：四家族計數 + 主導（最多）/缺席（為 0＝此生課題）。"""
    counts: Dict[str, int] = {"雷鳥": 0, "海龜": 0, "蝴蝶": 0, "青蛙": 0}
    for pid in positions:
        fam = family_of_pos(pid)
        if fam:
            counts[fam] += 1
    mx = max(counts.values())
    dominant = [k for k, v in counts.items() if v == mx and mx > 0]
    absent = [k for k, v in counts.items() if v == 0]
    return FamilyBalance(
        雷鳥=counts["雷鳥"], 海龜=counts["海龜"], 蝴蝶=counts["蝴蝶"], 青蛙=counts["青蛙"],
        dominant=dominant, absent=absent,
    )


def relate(a: str, b: str) -> Relation:
    """相合判定。藥輪不採二元對立、無嚴格不合。"""
    opp = load_spec()["opposite"]
    if a == b:
        return Relation(type="同族", desc="天生理解，能量加乘。")
    if opp.get(a) == b:
        return Relation(
            type="雙合（對立）",
            desc="互補極強，張力也大——元素相反（火↔風 或 土↔水）。",
        )
    return Relation(type="半合（相鄰）", desc="有共同語言，需磨合。")
