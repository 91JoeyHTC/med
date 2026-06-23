import { useWheelStore } from './store';
import WheelCanvas from './components/WheelCanvas';
import KnowledgePanel from './components/KnowledgePanel';
import DrawPanel from './components/DrawPanel';

const LEGEND = [
  { color: '#B0714A', label: '火・雷鳥' },
  { color: '#8A8C5E', label: '土・海龜' },
  { color: '#7BA39A', label: '風・蝴蝶' },
  { color: '#5E7A8C', label: '水・青蛙' },
  { color: '#3A3A3A', label: '路徑 25–36' },
];

function Tab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        padding: '0 2px 15px', background: 'none', border: 'none',
        borderBottom: `1px solid ${active ? '#1A1A1A' : 'transparent'}`,
        cursor: 'pointer', fontSize: 15, letterSpacing: '.02em', fontFamily: 'inherit',
        color: active ? '#1A1A1A' : '#6B6B6B', marginBottom: -1,
      }}>
      {label}
    </button>
  );
}

export default function App() {
  const { mode, setMode } = useWheelStore();

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 64px' }}>
      <header style={{ padding: '52px 4px 30px', textAlign: 'center', borderBottom: '1px solid #E8E4DD', marginBottom: 38 }}>
        <div style={{ fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6B6B6B', fontWeight: 500 }}>
          Medicine Wheel
        </div>
        <h1 style={{ margin: '16px 0 0', fontFamily: "'Noto Serif TC', serif", fontSize: 40, letterSpacing: '.02em', color: '#1A1A1A', fontWeight: 300 }}>
          藥輪 · 位置圖與繪盤
        </h1>
        <p style={{ margin: '14px auto 0', maxWidth: 700, color: '#6B6B6B', fontSize: 15, letterSpacing: '.01em', lineHeight: 1.85 }}>
          中央群集（造物者・天群・地群）· 四輻條路徑 25–36 · 外圈四方位與十二月亮。知識整理與個人／合盤繪製。
        </p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 44, margin: '0 0 38px', borderBottom: '1px solid #E8E4DD' }}>
        <Tab active={mode === 'know'} label="藥輪知識圖" onClick={() => setMode('know')} />
        <Tab active={mode === 'draw'} label="繪製藥輪盤" onClick={() => setMode('draw')} />
      </div>

      <div style={{ display: 'flex', gap: 34, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 560px', position: 'sticky', top: 10 }}>
          <WheelCanvas />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12, color: '#6B6B6B', justifyContent: 'center', marginTop: 10 }}>
            {LEGEND.map((l) => (
              <span key={l.label}>
                <i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 2, marginRight: 5, verticalAlign: -1, background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {mode === 'know' ? <KnowledgePanel /> : <DrawPanel />}
          <p style={{ margin: '16px 4px 0', color: '#9A9A9A', fontSize: 11, lineHeight: 1.8 }}>
            本工具以「能量互動模式」呈現，採陪伴而非預言之原則；非醫療、心理諮商或法律建議。內容以春花媽詮釋與 Sun Bear 傳統為本，逐字稿未深入處標註「未深入／待教材核對」。
          </p>
        </div>
      </div>
    </div>
  );
}
