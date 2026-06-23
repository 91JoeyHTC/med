"""pytest 金標：本命邊界/跨年/閏年、家族平衡、相合。對齊《工程開發文件》§12。"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.wheel import (  # noqa: E402
    calc_natal,
    family_balance,
    family_of_pos,
    natal_month,
    parse_positions,
    relate,
)


class TestNatal:
    def test_1015_raven(self):
        # 10/15 → 群鴨飛遷之月（渡鴉）／天秤／西方／蝴蝶
        n = calc_natal(10, 15)
        assert n["id"] == 22
        assert n["fullmonth"] == "群鴨飛遷之月（渡鴉）"
        assert n["zod"] == "天秤"
        assert n["dir"] == "西"
        assert n["fam"] == "蝴蝶"
        assert n["famId"] == 8
        assert n["dirId"] == 12

    def test_1225_earth_restore(self):
        # 12/25 → 大地復原之月／北／海龜（跨年區間）
        n = calc_natal(12, 25)
        assert n["id"] == 13
        assert n["dir"] == "北"
        assert n["fam"] == "海龜"

    def test_cross_year_boundaries(self):
        assert calc_natal(12, 22)["id"] == 13  # 區間起
        assert calc_natal(12, 31)["id"] == 13  # 年末
        assert calc_natal(1, 19)["id"] == 13   # 區間迄（跨年）
        assert calc_natal(1, 20)["id"] == 14   # 下一月起

    def test_leap_day(self):
        # 2/29 → 強風之月（休眠淨化止於 2/18）
        assert calc_natal(2, 29)["id"] == 15

    def test_every_day_resolves(self):
        dim = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        for mo in range(1, 13):
            for da in range(1, dim[mo - 1] + 1):
                assert natal_month(mo, da) is not None, f"{mo}/{da} 無對應月份"


class TestFamily:
    def test_family_of_pos(self):
        assert family_of_pos(22) == "蝴蝶"
        assert family_of_pos(7) == "雷鳥"
        assert family_of_pos(5) == "海龜"
        assert family_of_pos(1) is None

    def test_parse_positions(self):
        assert parse_positions("18,23、32 9") == [18, 23, 32, 9]
        assert parse_positions("0,37,abc,5") == [5]

    def test_balance_dominant_absent(self):
        # 本命 22(蝴蝶) + 落點 7(雷鳥),22(蝴蝶)
        bal = family_balance([22, 7, 22])
        assert bal["蝴蝶"] == 2
        assert bal["雷鳥"] == 1
        assert "蝴蝶" in bal["dominant"]
        assert "海龜" in bal["absent"] and "青蛙" in bal["absent"]


class TestRelate:
    def test_same_family(self):
        # 淑雯(蝴蝶) × 曉禾(蝴蝶) → 同族
        assert relate("蝴蝶", "蝴蝶")["type"] == "同族"

    def test_opposite_fire_wind(self):
        assert relate("雷鳥", "蝴蝶")["type"] == "雙合（對立）"

    def test_opposite_earth_water(self):
        assert relate("海龜", "青蛙")["type"] == "雙合（對立）"

    def test_adjacent(self):
        assert relate("雷鳥", "海龜")["type"] == "半合（相鄰）"
