// 從 packages/spec 複製單一真理規格到前端 src/data。
// 確保前端與 Python 引擎載入同一份 spec.json（CI 以雜湊比對一致性）。
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, '../../../packages/spec/medicine-wheel-spec.json');
const destDir = resolve(__dirname, '../src/data');
const dest = resolve(destDir, 'spec.json');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`[sync-spec] copied spec.json -> ${dest}`);
