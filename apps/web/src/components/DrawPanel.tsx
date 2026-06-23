import { useWheelStore } from '../store';
import { spec } from '../lib/wheel/spec';
import AnalysisPanel from './AnalysisPanel';

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF', border: '1px solid #E8E4DD', borderRadius: 2,
  padding: '20px 22px', marginBottom: 20,
};
const h2Style: React.CSSProperties = {
  margin: '0 0 6px', fontSize: 18, color: '#1A1A1A', fontFamily: "'Noto Serif TC', serif",
};
const fieldStyle: React.CSSProperties = {
  width: '100%', background: '#F4F1EC', border: '1px solid #E8E4DD', color: '#1A1A1A',
  borderRadius: 2, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: '#6B6B6B', margin: '10px 0 3px' };

const DIM = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function DrawPanel() {
  const { who, setWho, overlay, setOverlay, people, updateWho, computeNatal } = useWheelStore();
  const person = people[who];
  const days = DIM[(+person.bMon || 1) - 1];

  return (
    <>
      {/* ① 基本資料 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>① 基本資料</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label style={labelStyle}>對象</label>
            <select value={who} onChange={(e) => setWho(e.target.value as 'A' | 'B')} style={fieldStyle}>
              <option value="A">A（墨）</option>
              <option value="B">B（金，合盤用）</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>暱稱</label>
            <input value={person.name} onChange={(e) => updateWho((p) => { p.name = e.target.value; })}
              placeholder="如：淑雯" style={fieldStyle} />
          </div>
        </div>
        <label style={{ ...labelStyle, margin: '12px 0 3px' }}>
          生日（月/日）→ 自動定位本命方位／家族／月份
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          <select value={person.bMon} onChange={(e) => updateWho((p) => { p.bMon = e.target.value; })}
            style={{ ...fieldStyle, flex: 1 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1)}>{i + 1}月</option>
            ))}
          </select>
          <select value={person.bDay} onChange={(e) => updateWho((p) => { p.bDay = e.target.value; })}
            style={{ ...fieldStyle, flex: 1 }}>
            {Array.from({ length: days }, (_, i) => (
              <option key={i} value={String(i + 1)}>{i + 1}日</option>
            ))}
          </select>
          <button className="act-btn" onClick={computeNatal}
            style={{ background: '#1A1A1A', border: '1px solid #1A1A1A', color: '#fff', borderRadius: 2,
              padding: '9px 14px', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            推算本命
          </button>
        </div>
        {person.natal && (
          <div className="kb"
            style={{ fontSize: 12, color: '#6B6B6B', background: '#FAF8F4', border: '1px solid #E8E4DD',
              borderLeft: `3px solid ${spec.colors[who === 'A' ? 'markerA' : 'markerB']}`, borderRadius: 2,
              padding: '8px 10px', marginTop: 10 }}
            dangerouslySetInnerHTML={{
              __html: `<b>${person.name || who}</b>　本命月份：<b>${person.natal.fullmonth}</b>（${person.natal.zod}）｜本命方位：<b>${person.natal.dir}方</b>｜本命家族：<b>${person.natal.fam}家族・${person.natal.elem}</b>`,
            }}
          />
        )}
      </div>

      {/* ② 七守護靈落點 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>② 七守護靈落點</h2>
        <p style={{ margin: '4px 0 10px', color: '#6B6B6B', fontSize: 12 }}>
          本命由生日自動標出（方位／家族／月份）。其餘六隻填動物名稱＋落點位置編號（可多個，用逗號分隔，如 18,23,32）。落點可用 1–36 任一位置；盤面即時更新。
        </p>
        <div>
          {person.g.map((g, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1.25fr 1.45fr', gap: 10, alignItems: 'center', margin: '11px 0' }}>
              <span style={{ textAlign: 'center', fontWeight: 500, color: '#FFFFFF', background: '#1A1A1A',
                border: '1px solid #1A1A1A', borderRadius: 2, padding: '7px 0', fontSize: 13 }}>{g.dir}</span>
              <input value={g.name} onChange={(e) => updateWho((p) => { p.g[i].name = e.target.value; })}
                placeholder="動物，如 老鷹" style={fieldStyle} />
              <input value={g.posStr} onChange={(e) => updateWho((p) => { p.g[i].posStr = e.target.value; })}
                placeholder="落點，如 18,23,32" style={fieldStyle} />
            </div>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, color: '#6B6B6B', fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)}
            style={{ width: 'auto', accentColor: '#1A1A1A' }} />
          合盤模式（同時顯示 A＋B 雙色疊合）
        </label>
      </div>

      {/* 盤面圖例與分析 */}
      <div style={cardStyle}>
        <h2 style={{ ...h2Style, marginBottom: 8 }}>盤面圖例與分析</h2>
        <AnalysisPanel />
      </div>
    </>
  );
}
