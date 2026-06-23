-- 藥輪 App 初始 schema。對齊《工程開發文件》§5。
-- 使用者由 Supabase auth.users 提供。

-- 規格資料（可選：也可純前端 spec.json，不入庫）
create table if not exists positions (
  id int primary key,                 -- 1..36
  layer text not null,                -- center/sky/family/direction/moon/path
  name text not null,
  date_start text, date_end text,     -- moon
  zodiac text, element text, family text, direction text,
  north_animal text, tw_animal text,
  path_dir text, path_name text,
  knowledge jsonb                     -- 知識卡內容
);

create table if not exists charts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('personal','composite')),
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chart_people (
  id uuid primary key default gen_random_uuid(),
  chart_id uuid not null references charts(id) on delete cascade,
  slot text not null check (slot in ('A','B')),
  nickname text,
  birth_month int, birth_day int,
  natal jsonb                          -- {monthId,familyNode,dirNode,...}
);

create table if not exists chart_guardians (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references chart_people(id) on delete cascade,
  dir text not null check (dir in ('天','地','北','東','南','西')),
  animal text,
  positions int[] not null default '{}'
);

-- RLS：使用者只能存取自己的盤
alter table charts enable row level security;
alter table chart_people enable row level security;
alter table chart_guardians enable row level security;

create policy "own charts" on charts
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- chart_people / chart_guardians 透過 chart_id 連動同等政策（join 檢查）
create policy "own chart_people" on chart_people
  for all using (
    exists (select 1 from charts c where c.id = chart_people.chart_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from charts c where c.id = chart_people.chart_id and c.owner_id = auth.uid())
  );

create policy "own chart_guardians" on chart_guardians
  for all using (
    exists (
      select 1 from chart_people p
      join charts c on c.id = p.chart_id
      where p.id = chart_guardians.person_id and c.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from chart_people p
      join charts c on c.id = p.chart_id
      where p.id = chart_guardians.person_id and c.owner_id = auth.uid()
    )
  );

-- positions 為公開讀取的規格資料（無 RLS；以 service role 灌入 seed）
