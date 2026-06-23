"""FastAPI 計算與解析服務。對齊《工程開發文件》§8。

端點：
  POST /natal   {month,day}             -> Natal
  POST /balance {positions:[...]}       -> FamilyBalance
  POST /relate  {a, b}                  -> Relation
  POST /report  {chart}                 -> {rule, ai}
  GET  /spec                            -> spec.json
  GET  /health                          -> {status}
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .analysis import report as build_report
from .spec import load_spec
from .wheel import calc_natal, family_balance, relate

app = FastAPI(title="藥輪計算引擎", version="1.0.0")


class NatalIn(BaseModel):
    month: int = Field(ge=1, le=12)
    day: int = Field(ge=1, le=31)


class BalanceIn(BaseModel):
    positions: List[int]


class RelateIn(BaseModel):
    a: str
    b: str


class ReportIn(BaseModel):
    chart: Dict[str, Any]


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/spec")
def get_spec() -> Dict[str, Any]:
    return load_spec()


@app.post("/natal")
def post_natal(body: NatalIn) -> Dict[str, Any]:
    n: Optional[Dict[str, Any]] = calc_natal(body.month, body.day)  # type: ignore[assignment]
    if n is None:
        raise HTTPException(status_code=422, detail="無法對應本命月份")
    return n


@app.post("/balance")
def post_balance(body: BalanceIn) -> Dict[str, Any]:
    return family_balance(body.positions)  # type: ignore[return-value]


@app.post("/relate")
def post_relate(body: RelateIn) -> Dict[str, Any]:
    families = {"雷鳥", "海龜", "蝴蝶", "青蛙"}
    if body.a not in families or body.b not in families:
        raise HTTPException(status_code=422, detail="家族需為 雷鳥/海龜/蝴蝶/青蛙")
    return relate(body.a, body.b)  # type: ignore[return-value]


@app.post("/report")
def post_report(body: ReportIn) -> Dict[str, str]:
    return build_report(body.chart)
