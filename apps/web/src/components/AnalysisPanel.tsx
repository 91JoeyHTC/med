import { useWheelStore } from '../store';
import { spec } from '../lib/wheel/spec';
import { famCounts, parsePos, relate } from '../lib/wheel/calc';
import type { Family, Person, Who } from '../lib/wheel/types';

const COLORS: Record<Who, string> = { A: spec.colors.markerA, B: spec.colors.markerB };

function legendBlock(p: Who, person: Person): string {
  if (!person.natal && !person.g.some((g) => g.name)) return '';
  let h = `<p class="lgd" style="color:${COLORS[p]}"><b>● ${person.name || p}</b>　`;
  h += person.natal
    ? `${person.natal.fam}家族｜${person.natal.dir}方｜${person.natal.fullmonth}`
    : '（未設生日）';
  h += `</p>`;
  person.g.forEach((g) => {
    if (g.name) h += `<p class="lgd"><b>${g.dir}</b>　${g.name}　<span class="muted">${parsePos(g.posStr).join('、') || '—'}</span></p>`;
  });
  return h;
}

function famLine(person: Person, label: string): string {
  const c = famCounts(person);
  const total = c.雷鳥 + c.海龜 + c.蝴蝶 + c.青蛙;
  return `<p class="lgd"><b>${label}</b> 火/雷鳥 ${c.雷鳥}・土/海龜 ${c.海龜}・風/蝴蝶 ${c.蝴蝶}・水/青蛙 ${c.青蛙}` +
    (total
      ? `<br><span class="muted">主導：${c.dominant.join('、') || '—'}｜缺席：${c.absent.join('、') || '無'}（缺席元素＝此生需學習的課題）</span>`
      : '') +
    `</p>`;
}

function relationTable(fa: Family, fb: Family): string {
  const r = relate(fa, fb);
  return `<table><tr><th>A 本命家族</th><th>B 本命家族</th><th>關係</th></tr>` +
    `<tr><td>${fa}</td><td>${fb}</td><td><b>${r.type}</b></td></tr></table>` +
    `<p class="muted">${r.desc} 藥輪不採二元對立、無嚴格不合。重點觀察「本命・天・地」三位置的能量呼應。</p>`;
}

function buildAnalysisHtml(state: ReturnType<typeof useWheelStore.getState>): string {
  const { overlay, who, people } = state;
  let html = '';
  if (!overlay) {
    const block = legendBlock(who, people[who]);
    html += (block ? block + '<hr>' : '') + famLine(people[who], '家族平衡');
  } else {
    html += legendBlock('A', people.A) + legendBlock('B', people.B) + '<hr>' +
      famLine(people.A, 'A 家族平衡') + famLine(people.B, 'B 家族平衡');
    if (people.A.natal && people.B.natal) html += relationTable(people.A.natal.fam, people.B.natal.fam);
  }
  const hasInput =
    people[who].natal ||
    people[who].g.some((g) => g.name) ||
    (overlay &&
      (people.A.natal || people.B.natal || people.A.g.some((g) => g.name) || people.B.g.some((g) => g.name)));
  if (!hasInput) return `<span class="muted">輸入生日與守護靈後，這裡顯示守護靈清單、家族平衡與（合盤）相合分析。</span>`;
  return html;
}

export default function AnalysisPanel() {
  const state = useWheelStore();
  return (
    <div className="an" style={{ fontSize: 12, color: '#6B6B6B' }}
      dangerouslySetInnerHTML={{ __html: buildAnalysisHtml(state) }} />
  );
}
