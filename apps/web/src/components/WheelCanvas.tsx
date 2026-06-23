import { useWheelStore } from '../store';
import { spec, POS } from '../lib/wheel/spec';
import {
  CX, CY, R_SAT, R_PATH, R_OUTER, NODE, DIRNODE, CENTERANG, PATHDIR, PATHS, PERIM,
  pol, pAng, shade, pathIdx, nodeXY, nodeR,
} from '../lib/wheel/geometry';
import { parsePos } from '../lib/wheel/calc';
import type { Dir, Element, Person, Who } from '../lib/wheel/types';

const COLORS: Record<Who, string> = { A: spec.colors.markerA, B: spec.colors.markerB };
const SAT: Record<string, { n: string; t?: 'tian'; e?: Element }> = {
  '2': { n: '大地', t: 'tian' }, '3': { n: '太陽', t: 'tian' }, '4': { n: '月亮', t: 'tian' },
  '5': { n: '海龜', e: '土' }, '6': { n: '青蛙', e: '水' }, '7': { n: '雷鳥', e: '火' }, '8': { n: '蝴蝶', e: '風' },
};

function MarkerLayer() {
  const { people, who, overlay } = useWheelStore();
  const children: JSX.Element[] = [];
  const tagSlots: Record<number, number> = {};
  let key = 0;

  const mark = (id: number, color: string, text: string, poff: number) => {
    if (POS[id] == null) return;
    const [x, y] = nodeXY(id);
    const R = nodeR(id);
    children.push(
      <circle key={'k' + key++} cx={x} cy={y} r={R + 4 + poff} fill="none" stroke={color} strokeWidth={3} opacity={0.95} />
    );
    let dx = x - CX;
    let dy = y - CY;
    const d = Math.hypot(dx, dy) || 1;
    dx /= d;
    dy /= d;
    if (id === 1) { dx = 0; dy = -1; }
    const slot = tagSlots[id] || 0;
    tagSlots[id] = slot + 1;
    const px = x + dx * (R + 13);
    const py = y + dy * (R + 13) + slot * 13;
    const anchor = dx > 0.34 ? 'start' : dx < -0.34 ? 'end' : 'middle';
    children.push(
      <text key={'k' + key++} x={px} y={py} textAnchor={anchor} fontSize={10} fill={color}
        fontWeight={700} stroke="#FFFFFF" strokeWidth={0.7}>{text}</text>
    );
  };

  const set: Who[] = overlay ? ['A', 'B'] : [who];
  set.forEach((p, pi) => {
    const dat: Person = people[p];
    if (!dat) return;
    const col = COLORS[p];
    const poff = overlay ? pi * 5 : 0;
    if (dat.natal) {
      mark(dat.natal.id, col, '本命月份', poff);
      mark(dat.natal.famId, col, '本命家族', poff);
      mark(dat.natal.dirId, col, '本命方位', poff);
    }
    dat.g.forEach((g) => {
      if (g.name) parsePos(g.posStr).forEach((id) => mark(id, col, g.dir + '｜' + g.name, poff));
    });
  });
  return <g>{children}</g>;
}

export default function WheelCanvas() {
  const { mode, showKB } = useWheelStore();
  const ch: JSX.Element[] = [];
  const acc = spec.colors.pathStroke;

  // 外圈框線 + 四輻條
  ch.push(<circle key="outer" cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={spec.colors.hairline} strokeWidth={1} />);
  (['北', '東', '南', '西'] as Dir[]).forEach((dir) => {
    const [x, y] = pol(PATHDIR[dir], R_OUTER - DIRNODE);
    ch.push(<line key={'sp' + dir} x1={CX} y1={CY} x2={x} y2={y} stroke={spec.colors.hairline} strokeWidth={1.2} />);
  });

  // 外圈 16 節點（4 方位 + 12 月亮）
  PERIM.forEach((p) => {
    const ang = pAng(p.k);
    const [x, y] = pol(ang, R_OUTER);
    if (p.type === 'dir') {
      const dir = (p as { dir: Dir }).dir;
      const dd = spec.directions[dir];
      const col = spec.elements[dd.elem].color;
      const id = dd.id;
      ch.push(
        <circle key={'d' + dir} cx={x} cy={y} r={DIRNODE} fill={spec.colors.dirNodeFill} stroke={col} strokeWidth={2.6}
          className="seg" style={{ cursor: mode === 'know' ? 'pointer' : 'default' }}
          onClick={() => mode === 'know' && showKB(id)} />
      );
      ch.push(<text key={'dt' + dir} x={x} y={y - 2} textAnchor="middle" fill="#fff" fontWeight={600} fontSize={16} style={{ pointerEvents: 'none' }}>{dir}</text>);
      ch.push(<text key={'ds' + dir} x={x} y={y + 12} textAnchor="middle" fill="#fff" fontWeight={600} fontSize={9} opacity={0.92} style={{ pointerEvents: 'none' }}>{dd.season}</text>);
    } else {
      const mid = (p as { id: number }).id;
      const m = spec.moons.find((mm) => mm.id === mid)!;
      const col = spec.elements[m.element].color;
      const short = m.name.replace('之月', '').replace(/（.*/, '');
      ch.push(
        <circle key={'m' + m.id} cx={x} cy={y} r={NODE} fill={col} stroke="#FFFFFF" strokeWidth={1.5}
          className="seg" style={{ cursor: mode === 'know' ? 'pointer' : 'default' }}
          onClick={() => mode === 'know' && showKB(m.id)} />
      );
      ch.push(<text key={'mt' + m.id} x={x} y={y - 4} textAnchor="middle" fill="#fff" fontWeight={600} fontSize={11} style={{ pointerEvents: 'none' }}>{m.id}</text>);
      ch.push(<text key={'ms' + m.id} x={x} y={y + 9} textAnchor="middle" fill="#fff" fontWeight={600} fontSize={9} style={{ pointerEvents: 'none' }}>{short}</text>);
    }
  });

  // 路徑 25–36
  Object.keys(PATHS).forEach((id) => {
    const ang = PATHDIR[PATHS[id]];
    const [x, y] = pol(ang, R_PATH[pathIdx(id)]);
    ch.push(
      <circle key={'p' + id} cx={x} cy={y} r={15} fill={spec.colors.pathFill} stroke={acc} strokeWidth={1.2}
        className="seg" style={{ cursor: mode === 'know' ? 'pointer' : 'default' }}
        onClick={() => mode === 'know' && showKB(Number(id))} />
    );
    ch.push(<text key={'pn' + id} x={x} y={y - 3} textAnchor="middle" fill={spec.colors.ink} fontWeight={600} fontSize={8} style={{ pointerEvents: 'none' }}>{id}</text>);
    ch.push(<text key={'pl' + id} x={x} y={y + 8} textAnchor="middle" fill={spec.colors.ink} fontWeight={600} fontSize={9} style={{ pointerEvents: 'none' }}>{spec.paths[id].name}</text>);
  });

  // 中央群集衛星 2–8
  Object.keys(SAT).forEach((id) => {
    const sat = SAT[id];
    const [x, y] = pol(CENTERANG[id], R_SAT);
    const isTian = sat.t === 'tian';
    const fill = isTian ? spec.colors.satSky : shade(spec.elements[sat.e!].color, 0.82);
    const textFill = isTian ? spec.colors.ink : '#fff';
    ch.push(
      <circle key={'s' + id} cx={x} cy={y} r={17} fill={fill} stroke="#FFFFFF" strokeWidth={1.5}
        className="seg" style={{ cursor: mode === 'know' ? 'pointer' : 'default' }}
        onClick={() => mode === 'know' && showKB(+id)} />
    );
    ch.push(<text key={'sn' + id} x={x} y={y - 3} textAnchor="middle" fill={textFill} fontWeight={600} fontSize={9} style={{ pointerEvents: 'none' }}>{id}</text>);
    ch.push(<text key={'sl' + id} x={x} y={y + 8} textAnchor="middle" fill={textFill} fontWeight={600} fontSize={9} style={{ pointerEvents: 'none' }}>{sat.n}</text>);
  });

  // 中心造物者 1
  ch.push(
    <circle key="c0" cx={CX} cy={CY} r={19} fill={spec.colors.center} stroke={spec.colors.ink} strokeWidth={1.5}
      className="seg" style={{ cursor: mode === 'know' ? 'pointer' : 'default' }}
      onClick={() => mode === 'know' && showKB(1)} />
  );
  ch.push(<text key="c1" x={CX} y={CY + 1} textAnchor="middle" fill={spec.colors.ink} fontWeight={600} fontSize={12} style={{ pointerEvents: 'none' }}>1</text>);
  ch.push(<text key="c2" x={CX} y={CY + 13} textAnchor="middle" fill={spec.colors.ink} fontWeight={600} fontSize={8} style={{ pointerEvents: 'none' }}>造物者</text>);

  return (
    <svg viewBox="0 0 560 560" aria-label="藥輪盤" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {ch}
      {mode === 'draw' && <MarkerLayer />}
    </svg>
  );
}
