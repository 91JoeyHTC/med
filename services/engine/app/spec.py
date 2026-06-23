"""載入單一真理規格 medicine-wheel-spec.json。

引擎以 packages/spec 為唯一資料來源；CI 以雜湊比對前端 src/data/spec.json 一致。
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict

# services/engine/app/spec.py -> repo 根 -> packages/spec/medicine-wheel-spec.json
_SPEC_PATH = (
    Path(__file__).resolve().parents[3] / "packages" / "spec" / "medicine-wheel-spec.json"
)


@lru_cache(maxsize=1)
def load_spec() -> Dict[str, Any]:
    with _SPEC_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


@lru_cache(maxsize=1)
def position_names() -> Dict[int, str]:
    """1–12 固定 + 月份 + 路徑 → 顯示名。"""
    spec = load_spec()
    names: Dict[int, str] = {int(k): v for k, v in spec["positionNames"].items()}
    for m in spec["moons"]:
        names[m["id"]] = m["name"].replace("之月", "")
    for pid, p in spec["paths"].items():
        names[int(pid)] = p["name"]
    return names


SPEC_PATH = _SPEC_PATH
