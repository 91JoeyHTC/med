"""解析報告（R2）：規則層由模板組裝；AI 層呼叫 LLM（可選）。

強調陪伴非預言、加免責；不得命定式陳述。逐字稿未深入處保留標註。
"""
from __future__ import annotations

import os
from typing import Any, Dict, List

from .wheel import calc_natal, family_balance, parse_positions, relate

DISCLAIMER = (
    "本內容以「能量互動模式」呈現，採陪伴而非預言之原則；"
    "非醫療、心理諮商或法律建議。內容以春花媽詮釋與 Sun Bear 傳統為本，"
    "逐字稿未深入處以「未深入／待教材核對」標註，不臆測補述。"
)


def _person_positions(person: Dict[str, Any]) -> List[int]:
    positions: List[int] = []
    natal = person.get("natal")
    if natal:
        positions.append(natal["id"])
    for g in person.get("guardians", []):
        if g.get("animal"):
            positions.extend(parse_positions(",".join(map(str, g.get("positions", [])))))
    return positions


def rule_report(chart: Dict[str, Any]) -> str:
    """規則層：依本命、家族平衡、（合盤）相合組裝模板文字。"""
    people = chart.get("people", [])
    lines: List[str] = []
    for person in people:
        nick = person.get("nickname") or "（未命名）"
        natal = person.get("natal")
        if natal is None and person.get("birth"):
            natal = calc_natal(person["birth"]["month"], person["birth"]["day"])
        if natal:
            lines.append(
                f"【{nick}】本命：{natal['fullmonth']}（{natal['zod']}）｜"
                f"{natal['dir']}方｜{natal['fam']}家族・{natal['elem']}。"
            )
        bal = family_balance(_person_positions({**person, "natal": natal}))
        lines.append(
            f"　家族平衡：火/雷鳥 {bal['雷鳥']}・土/海龜 {bal['海龜']}・"
            f"風/蝴蝶 {bal['蝴蝶']}・水/青蛙 {bal['青蛙']}。"
            f"主導：{'、'.join(bal['dominant']) or '—'}｜"
            f"缺席：{'、'.join(bal['absent']) or '無'}（缺席元素＝此生需學習的課題）。"
        )

    if chart.get("type") == "composite" and len(people) >= 2:
        a, b = people[0].get("natal"), people[1].get("natal")
        if a and b:
            r = relate(a["fam"], b["fam"])
            lines.append(f"【相合】{a['fam']} × {b['fam']}：{r['type']}。{r['desc']}")

    lines.append(DISCLAIMER)
    return "\n".join(lines)


def ai_report(chart: Dict[str, Any]) -> str:
    """AI 層：若設定 ANTHROPIC_API_KEY 則呼叫 LLM；否則回傳規則層摘要。

    system prompt 取自「藥輪分析師」設定，強調陪伴非預言、加免責。
    （骨架：此處不硬編 LLM 呼叫，避免無金鑰時失敗；串接時補入。）
    """
    if not os.getenv("ANTHROPIC_API_KEY"):
        return "（未設定 LLM 金鑰，僅提供規則層解析。）\n" + rule_report(chart)
    # TODO(R2): 呼叫 Anthropic API，system prompt = 藥輪分析師設定。
    return rule_report(chart)


def report(chart: Dict[str, Any]) -> Dict[str, str]:
    return {"rule": rule_report(chart), "ai": ai_report(chart)}
