// 產生 position_content 的「初始」seed（一次性 bootstrap）。
// 由 packages/spec/medicine-wheel-spec.json 的 knowledge 1..24 產生 summary_html。
// 之後 Supabase 為內容真理來源——本檔用 `on conflict do nothing`，重跑不會覆蓋你在 Studio 的編輯。
// 逐字稿詳細內容（detail_html）另以 update 腳本逐步補，不在此 bootstrap。
// 用法：node scripts/gen-content-seed.mjs > supabase/seed_content.sql
import { readFileSync } from 'node:fs';

const spec = JSON.parse(readFileSync('packages/spec/medicine-wheel-spec.json', 'utf-8'));
const esc = (s) => (s == null ? 'null' : `'${String(s).replace(/'/g, "''")}'`);
const jsonb = (v) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const coverageOf = (html, tags) => {
  const blob = html + ' ' + (tags || []).join(' ');
  if (/未涵蓋|課程未深入北方|未提供完整|尚無/.test(blob)) return 'uncovered';
  if (/未深入|未涵蓋|課程未|待教材核對/.test(blob)) return 'partial';
  return 'full';
};

const rows = [];
for (let id = 1; id <= 24; id++) {
  const k = spec.knowledge[String(id)];
  if (!k) continue;
  rows.push(
    `(${id}, ${esc(k.title)}, ${jsonb(k.tags || [])}, ${esc(k.html)}, null, ${esc(coverageOf(k.html, k.tags))}, null)`
  );
}

const header = `-- position_content「初始」seed。由 packages/spec/medicine-wheel-spec.json 的 knowledge 1..24 產生。
-- Supabase 為內容真理來源；此檔為一次性 bootstrap，on conflict do nothing 不覆蓋既有（Studio 編輯後）資料。
-- 灌入：supabase db push（套用 migration）後 \\i supabase/seed.sql 再 \\i supabase/seed_content.sql。

insert into position_content (position_id, title, tags, summary_html, detail_html, coverage, source_ref)
values
`;

process.stdout.write(header + rows.join(',\n') + '\non conflict (position_id) do nothing;\n');
