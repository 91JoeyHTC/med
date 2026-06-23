// 三端一致性檢查：packages/spec 與 apps/web/src/data 載入同一份 spec.json（雜湊比對）。
// CI step；不一致則 exit 1。
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sources = {
  'packages/spec': resolve(root, 'packages/spec/medicine-wheel-spec.json'),
  'apps/web/src/data': resolve(root, 'apps/web/src/data/spec.json'),
};

const hashes = Object.fromEntries(
  Object.entries(sources).map(([name, p]) => {
    const buf = readFileSync(p);
    return [name, createHash('sha256').update(buf).digest('hex')];
  })
);

const unique = new Set(Object.values(hashes));
for (const [name, h] of Object.entries(hashes)) console.log(`${h.slice(0, 12)}  ${name}`);

if (unique.size !== 1) {
  console.error('\n✗ spec.json 不一致！請執行 `npm run sync:spec`（web）後重試。');
  process.exit(1);
}
console.log('\n✓ spec 三端一致。');
