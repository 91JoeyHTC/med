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

需要一個 Supabase 專案（https://supabase.com → New project）。

1. **套用 migrations + 灌 seeds（一個指令）**。連線字串在 Supabase → Project Settings → Database → Connection string → URI（記得填入你的資料庫密碼）：
   ```bash
   npm install   # 取得 pg
   DATABASE_URL="postgresql://postgres:<密碼>@db.<ref>.supabase.co:5432/postgres" npm run db:setup
   ```
   `db:setup` 依序套用 `0001/0002` migration 與三份 seed，並略過「already exists」（可安全重跑）。
   - `seed_content.sql` 用 `on conflict do nothing`，不覆蓋你在 Studio 的編輯；
   - `seed_content_detail.sql` 為 `update`，把逐字稿涵蓋位置（造物者/大地母親/太陽/月亮/海龜/烈日/採莓/收穫/渡鴉/蛇/馬駝鹿）的 `detail_html` 一次補上。
2. 設定前端環境變數（兩處）。URL 與 anon key 在 Supabase → Project Settings → API：
   - 本地 `apps/web/.env`：
     ```
     VITE_SUPABASE_URL=https://<ref>.supabase.co
     VITE_SUPABASE_ANON_KEY=<anon public key>
     ```
   - Cloudflare：Worker `med` → Settings → Variables，加同樣兩個變數，再重新部署。

## 日常維護

- 改內容 → Supabase Studio → `position_content` 表 → 編輯 `summary_html` / `detail_html` / `coverage` → 存檔。重新整理網站即生效。
- `coverage`：`full`（完整）/ `partial`（部分・待補）/ `uncovered`（逐字稿未涵蓋）。
- `detail_html`：逐字稿詳細內容，前端以可收合「詳細（逐字稿）」區塊呈現；可逐步補。
- 改「結構」（新增月份、改日期/元素等）仍走 `spec.json` → `npm run gen:seed` / `gen:content` 重生 seed。

## 權限

- `position_content`：公開讀取（anon SELECT）；寫入僅限 service_role（Studio / 後台），anon 不可寫。
