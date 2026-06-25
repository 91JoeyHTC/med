// 一鍵套用藥輪資料庫：migrations + seeds。
// 用法：DATABASE_URL="postgresql://postgres:<密碼>@db.<ref>.supabase.co:5432/postgres" npm run db:setup
// 連線字串：Supabase 專案 → Project Settings → Database → Connection string → URI（記得填入你的密碼）。
// 對既有物件的「already exists」錯誤會略過，所以可安全重跑。
import { readFileSync } from 'node:fs';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ 請設定 DATABASE_URL（Supabase 連線字串）。');
  process.exit(1);
}

const files = [
  'supabase/migrations/0001_init.sql',
  'supabase/migrations/0002_position_content.sql',
  'supabase/seed.sql',
  'supabase/seed_content.sql',
  'supabase/seed_content_detail.sql',
];

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

const run = async () => {
  await client.connect();
  console.log('✓ 已連線 Supabase');
  for (const f of files) {
    const sql = readFileSync(f, 'utf8');
    try {
      await client.query(sql);
      console.log(`✓ 套用 ${f}`);
    } catch (e) {
      if (/already exists/i.test(e.message)) {
        console.log(`• 略過 ${f}（部分物件已存在：${e.message.split('\n')[0]}）`);
      } else {
        console.error(`✗ ${f} 失敗：${e.message}`);
        throw e;
      }
    }
  }
  await client.end();
  console.log('\n✓ 完成。前端設定 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 後即會讀取 DB 內容。');
};

run().catch((e) => { console.error(e); process.exit(1); });
