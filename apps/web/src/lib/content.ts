// 內容 runtime 讀取層。
// Supabase 的 position_content 為內容真理來源；讀不到（未設環境變數/離線/未套用 migration）
// 則回 null，由呼叫端 fallback 回 bundled spec.knowledge。零依賴，直接打 PostgREST。

export interface ContentRow {
  position_id: number;
  title: string;
  tags: string[];
  summary_html: string | null;
  detail_html: string | null;
  coverage: 'full' | 'partial' | 'uncovered';
}

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export async function fetchContent(): Promise<Record<string, ContentRow> | null> {
  if (!URL || !KEY) return null; // 未設定 → 用 bundled fallback
  try {
    const res = await fetch(`${URL}/rest/v1/position_content?select=*`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as ContentRow[];
    const map: Record<string, ContentRow> = {};
    for (const r of rows) map[String(r.position_id)] = r;
    return map;
  } catch {
    return null; // 網路/CORS 失敗 → fallback
  }
}
