import { readFileSync } from 'node:fs';
const spec = JSON.parse(readFileSync('packages/spec/medicine-wheel-spec.json','utf-8'));
const esc = (s) => s == null ? 'null' : `'${String(s).replace(/'/g,"''")}'`;
const rows = [];
const kb = (id) => spec.knowledge[String(id)] ? `'${JSON.stringify(spec.knowledge[String(id)]).replace(/'/g,"''")}'::jsonb` : 'null';
// 1 center
rows.push(`(1,'center',${esc(spec.positionNames['1'])},null,null,null,null,null,null,null,null,null,null,${kb(1)})`);
// 2-4 sky, 5-8 family
const sat = spec.satellites;
for (const id of [2,3,4]) rows.push(`(${id},'sky',${esc(spec.positionNames[String(id)])},null,null,null,null,null,null,null,null,null,null,${kb(id)})`);
for (const id of [5,6,7,8]) { const e = sat[String(id)].elem; rows.push(`(${id},'family',${esc(spec.positionNames[String(id)])},null,null,null,${esc(e)},${esc(spec.elements[e].family)},null,null,null,null,${kb(id)})`); }
// 9-12 direction
for (const dir of ['北','東','南','西']) { const d = spec.directions[dir]; rows.push(`(${d.id},'direction',${esc(spec.positionNames[String(d.id)])},null,null,null,${esc(d.elem)},${esc(spec.familyOfElement[d.elem])},${esc(dir)},null,null,null,${kb(d.id)})`); }
// 13-24 moons
for (const m of spec.moons) { const [m0,d0,m1,d1]=m.dateRange; rows.push(`(${m.id},'moon',${esc(m.name)},${esc(m0+'/'+d0)},${esc(m1+'/'+d1)},${esc(m.zodiac)},${esc(m.element)},${esc(m.family)},${esc(m.dir)},${esc(m.northAnimal)},${esc(m.twAnimal)},null,null,${kb(m.id)})`); }
// 25-36 paths
for (const [id,p] of Object.entries(spec.paths)) rows.push(`(${id},'path',${esc(p.name)},null,null,null,null,null,null,null,null,${esc(p.dir)},${esc(p.name)},null)`);
const header = `-- 藥輪位置 seed。由 packages/spec/medicine-wheel-spec.json 產生（請勿手改；改 spec 後以 scripts 重生）。\n-- 灌入：supabase db push 後 \\i supabase/seed.sql 或 supabase db reset。\n\ninsert into positions\n  (id, layer, name, date_start, date_end, zodiac, element, family, direction, north_animal, tw_animal, path_dir, path_name, knowledge)\nvalues\n`;
process.stdout.write(header + rows.join(',\n') + '\non conflict (id) do update set\n  layer=excluded.layer, name=excluded.name, date_start=excluded.date_start, date_end=excluded.date_end,\n  zodiac=excluded.zodiac, element=excluded.element, family=excluded.family, direction=excluded.direction,\n  north_animal=excluded.north_animal, tw_animal=excluded.tw_animal, path_dir=excluded.path_dir,\n  path_name=excluded.path_name, knowledge=excluded.knowledge;\n');
