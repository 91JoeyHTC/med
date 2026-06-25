-- 0002：藥輪內容資料庫化。
-- position_content 為「內容」真理來源，可在 Supabase Studio 直接編輯維護（免改 code、免重新部署）。
-- positions 表仍存「結構」（由 spec.json 產生，計算用、勿手改）。
-- 前端 runtime 讀取 position_content；讀不到（未設環境變數/離線/未套用此 migration）則 fallback 回 bundled 內容。

create table if not exists position_content (
  position_id  int primary key references positions(id) on delete cascade,  -- 1..24（造物者/天群/地群/方位/月份）
  title        text not null,
  tags         jsonb not null default '[]'::jsonb,
  summary_html text,                    -- 精煉知識卡（卡片主體）
  detail_html  text,                    -- 逐字稿詳細內容（可逐步補；前端以可收合區塊呈現）
  coverage     text not null default 'full' check (coverage in ('full','partial','uncovered')),
  source_ref   text,                    -- 來源場次標註，如「第三場 2026-06-13」
  updated_at   timestamptz not null default now()
);

alter table position_content enable row level security;

-- 公開讀取；寫入僅限 service_role（Supabase Studio / 後台），anon 不可寫
create policy "public read position_content" on position_content
  for select using (true);

-- updated_at 自動更新
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger position_content_updated_at
  before update on position_content
  for each row execute function set_updated_at();
