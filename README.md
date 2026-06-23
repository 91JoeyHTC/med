# 藥輪 App（Medicine Wheel）

把北美原住民藥輪（Sun Bear／春花媽詮釋的台灣藥輪）數位化的瀏覽＋繪盤平台。核心是一張共用的 **36 位置藥輪盤**，搭配三種模式：

- **M1 知識盤**：點盤面節點 → 右側知識卡；另含 7 篇「藥輪總論」。
- **M2 個人盤**：輸入生日 → 自動推算本命月份／方位／家族；填 6 隻守護靈落點即時繪環；計算家族平衡（主導／缺席＝此生課題）。
- **M3 合盤**：疊合 A、B 雙色標記，判定兩人本命家族相合（同族／半合／雙合對立）。

風格採 **B&O 純白藝廊風**（白底、墨黑字、暖金屬點綴、銳角、髮絲線、無陰影）。

## Monorepo 結構

```
medicine-wheel/
├─ apps/
│  ├─ web/                React + Tailwind + Vite（前端，所有計算可在前端跑）
│  └─ api/                NestJS API Gateway（Auth・盤面 CRUD・BFF）
├─ services/
│  └─ engine/             Python FastAPI 計算引擎（真理來源）+ pytest 金標
├─ packages/
│  └─ spec/               ★ 單一真理：medicine-wheel-spec.json + 型別
├─ supabase/
│  ├─ migrations/0001_init.sql
│  └─ seed.sql            （由 spec 產生：npm run gen:seed）
├─ scripts/               gen-seed・check-spec-consistency
└─ .github/workflows/ci.yml
```

## 單一真理（spec）

`packages/spec/medicine-wheel-spec.json` 是唯一資料來源，含 36 位置、知識卡、總論、幾何與所有對應表。

- 前端載入 `apps/web/src/data/spec.json`（由 `npm run sync:spec` 從 spec 複製；已 gitignore）。
- 引擎載入 `packages/spec/medicine-wheel-spec.json`（`services/engine/app/spec.py`）。
- **任何資料更動只改 spec**，再 `npm run sync:spec` 與 `npm run gen:seed`；CI 以雜湊比對三端一致。

## 快速開始

前置：Node ≥ 20、Python ≥ 3.12。

```bash
npm install                 # 安裝 web/api workspaces
npm run sync:spec           # 同步 spec 到前端

# 前端（純前端即可玩完整繪盤，無需後端）
npm run dev:web             # http://localhost:5173

# 計算引擎
cd services/engine && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs

# API Gateway（需 engine 在 :8000）
npm run dev:api             # http://localhost:3000/api
```

## 測試

```bash
npm run test:web            # vitest：natal/family/relate 金標
npm run test:engine         # pytest：本命邊界・跨年・閏年・家族平衡・相合
npm run check:spec          # spec 三端一致性
```

**必過金標**：`10/15 → 渡鴉/天秤/西/蝴蝶`、`12/25 → 大地復原/北/海龜`、`2/29 → 強風`、合盤蝴蝶×蝴蝶 → 同族。

## API 合約（NestJS，base `/api`）

| Method | Path | 說明 |
|---|---|---|
| GET | `/spec` | 藥輪規格 |
| GET | `/knowledge/:id` | 位置知識卡 |
| POST | `/compute/natal` | 生日算本命（轉呼 engine）|
| POST | `/compute/analyze` | 家族平衡／相合 |
| GET/POST | `/charts` | 我的盤列表／建立 |
| GET/PUT/DELETE | `/charts/:id` | 單盤讀／改／刪 |
| POST | `/charts/:id/report` | 解析報告（R2）|
| POST | `/charts/:id/export` | 匯出圖（R3，骨架）|

需 `Authorization: Bearer <supabase access token>`。

## 技術棧與部署

React + Tailwind（Vercel）／ NestJS（容器化 → Render/Railway/Fly）／ Python FastAPI（容器化）／ Supabase（Postgres + Auth + Storage）。`supabase db push` 套用 migrations，灌入 `seed.sql`。詳見 `docs/`（原始 PM／UIUX／工程文件）。

## 目前狀態

- ✅ **apps/web**：完整可運作，1:1 重建 B&O 原型；計算全在前端；localStorage 暫存（R1 我的盤）。
- ✅ **services/engine**：演算法與 pytest 金標完成（12 案例通過）。
- 🟡 **apps/api**：NestJS 骨架（路由／DTO／engine 代理／Auth guard／in-memory charts），待接 Supabase。
- 🟡 **supabase**：migrations + seed 完成，待實際專案套用。
- 🟡 **R2 解析 AI 層**：規則層完成；LLM 串接待補（需金鑰，加免責、非命定）。

## 內容／倫理

工具以「能量互動模式」呈現，採**陪伴而非預言**原則；非醫療、心理諮商或法律建議。內容以春花媽詮釋與 Sun Bear 傳統為本，逐字稿未深入處保留「未深入／待教材核對」標註，不臆測補述。
