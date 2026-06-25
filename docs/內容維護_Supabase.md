# 藥輪內容維護（Supabase 內容資料庫）

藥輪「內容」（每個位置的知識卡與逐字稿詳細）已資料庫化，與「結構」分離，方便持續更新維護。

## 架構

```
結構（計算用）   packages/spec/medicine-wheel-spec.json  ─→ 前端、Python 引擎、positions 表
內容（可編輯）   Supabase  position_content 表           ─→ 前端 runtime 讀取
```

- **結構**（位置、日期、星座、元素、家族、方位、路徑）仍由 `spec.json` 當單一真理來源，三端 hash 一致、勿手改。
- **內容**（`title` / `tags` / `summary_html` / `detail_html` / `coverage`）以 Supabase `position_content` 表為真理來源，**可在 Supabase Studio 直接編輯，存檔即更新、免改 code、免重新部署**。
- 前端啟動時打 PostgREST 讀取（`apps/web/src/lib/content.ts`）；**讀不到（未設環境變數／離線／未套用 migration）則 fallback 回 bundled `spec.knowledge`**，所以網站永遠不會因此壞掉。

## 首次設定（一次性）

1. 套用 migration（建立 `position_content` 表 + 公開讀取 RLS）：
   ```bash
   supabase db push
   ```
2. 灌入初始資料（先結構、再內容）：
   ```bash
   psql "$DATABASE_URL" -f supabase/seed.sql          # positions（結構）
   psql "$DATABASE_URL" -f supabase/seed_content.sql  # position_content（內容初始 bootstrap）
   ```
   `seed_content.sql` 用 `on conflict do nothing`，重跑不會覆蓋你在 Studio 的編輯。
3. 設定前端環境變數（本地 `apps/web/.env`、以及 Cloudflare 專案 Variables）：
   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```

## 日常維護

- 改內容 → Supabase Studio → `position_content` 表 → 編輯 `summary_html` / `detail_html` / `coverage` → 存檔。重新整理網站即生效。
- `coverage`：`full`（完整）/ `partial`（部分・待補）/ `uncovered`（逐字稿未涵蓋）。
- `detail_html`：逐字稿詳細內容，前端以可收合「詳細（逐字稿）」區塊呈現；可逐步補。
- 改「結構」（新增月份、改日期/元素等）仍走 `spec.json` → `npm run gen:seed` / `gen:content` 重生 seed。

## 權限

- `position_content`：公開讀取（anon SELECT）；寫入僅限 service_role（Studio / 後台），anon 不可寫。
