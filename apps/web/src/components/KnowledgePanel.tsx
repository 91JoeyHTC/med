import { useWheelStore } from '../store';
import { spec } from '../lib/wheel/spec';
import { PATHS } from '../lib/wheel/geometry';

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF', border: '1px solid #E8E4DD', borderRadius: 2,
  padding: '20px 22px', marginBottom: 20,
};
const titleStyle: React.CSSProperties = {
  margin: '0 0 4px', fontSize: 18, color: '#1A1A1A', fontFamily: "'Noto Serif TC', serif",
};
const tagStyle: React.CSSProperties = {
  fontSize: 12, padding: '3px 10px', borderRadius: 2,
  background: '#F4F1EC', border: '1px solid #E8E4DD', color: '#6B6B6B',
};

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' }}>
      {tags.map((t, i) => <span key={i} style={tagStyle}>{t}</span>)}
    </div>
  );
}

function KnowledgeCard() {
  const { activeKB, activeGeneral } = useWheelStore();

  if (activeGeneral) {
    return (
      <div>
        <h2 style={titleStyle}>{activeGeneral}</h2>
        <div className="kb" dangerouslySetInnerHTML={{ __html: spec.general[activeGeneral] }} />
      </div>
    );
  }

  const k = activeKB;
  if (PATHS[String(k)]) {
    const p = spec.paths[String(k)];
    const html = `<p><b>${p.name}：</b>${p.gloss || ''}</p>` + spec.knowledge.path.html;
    return (
      <div>
        <h2 style={titleStyle}>{`路徑 ${k}・${p.name}（${p.dir}方）`}</h2>
        <TagRow tags={[`${p.dir}方輻條`, '編號由外向內']} />
        <div className="kb" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  const item = spec.knowledge[String(k)];
  if (!item) {
    return <p style={{ color: '#6B6B6B', fontSize: 13 }}>此位置尚無知識卡內容（待教材核對）。</p>;
  }
  return (
    <div>
      <h2 style={titleStyle}>{item.title}</h2>
      <TagRow tags={item.tags || []} />
      <div className="kb" dangerouslySetInnerHTML={{ __html: item.html }} />
    </div>
  );
}

export default function KnowledgePanel() {
  const { showGeneral } = useWheelStore();
  const topics = Object.keys(spec.general);
  return (
    <>
      <div style={{ ...cardStyle, minHeight: 120 }}>
        <KnowledgeCard />
      </div>
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 10px', fontSize: 14, color: '#1A1A1A', letterSpacing: 1 }}>
          藥輪總論（基礎理論）
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {topics.map((name) => (
            <span key={name} className="topic-chip" onClick={() => showGeneral(name)}
              style={{ fontSize: 12, padding: '4px 11px', borderRadius: 2, background: '#F4F1EC',
                border: '1px solid #E8E4DD', color: '#1A1A1A', cursor: 'pointer' }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
