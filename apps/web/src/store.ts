import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { spec } from './lib/wheel/spec';
import { calcNatal } from './lib/wheel/calc';
import { fetchContent, type ContentRow } from './lib/content';
import type { Mode, Person, Who } from './lib/wheel/types';

function newPerson(): Person {
  return {
    name: '',
    bMon: '1',
    bDay: '1',
    natal: null,
    g: spec.guardianDirs.map((d) => ({ dir: d, name: '', posStr: '' })),
  };
}

interface WheelState {
  mode: Mode;
  activeKB: number;
  activeGeneral: string | null;
  who: Who;
  overlay: boolean;
  people: { A: Person; B: Person };
  content: Record<string, ContentRow> | null;

  loadContent: () => Promise<void>;
  setMode: (mode: Mode) => void;
  showKB: (id: number) => void;
  showGeneral: (name: string) => void;
  setWho: (who: Who) => void;
  setOverlay: (overlay: boolean) => void;
  updateWho: (fn: (p: Person) => void) => void;
  computeNatal: () => void;
  reset: () => void;
}

export const useWheelStore = create<WheelState>()(
  persist(
    (set, get) => ({
      mode: 'know',
      activeKB: 1,
      activeGeneral: null,
      who: 'A',
      overlay: false,
      people: { A: newPerson(), B: newPerson() },
      content: null,

      loadContent: async () => {
        const c = await fetchContent();
        if (c) set({ content: c });
      },
      setMode: (mode) => set({ mode }),
      showKB: (id) => set({ activeKB: id, activeGeneral: null }),
      showGeneral: (name) => set({ activeGeneral: name }),
      setWho: (who) => set({ who }),
      setOverlay: (overlay) => set({ overlay }),

      updateWho: (fn) =>
        set((s) => {
          const people = { ...s.people };
          const person: Person = { ...people[s.who], g: people[s.who].g.map((x) => ({ ...x })) };
          fn(person);
          people[s.who] = person;
          return { people };
        }),

      computeNatal: () =>
        get().updateWho((p) => {
          p.natal = calcNatal(+p.bMon, +p.bDay);
        }),

      reset: () => set({ people: { A: newPerson(), B: newPerson() }, overlay: false }),
    }),
    {
      name: 'medicine-wheel:people',
      // 僅持久化盤資料（對應 PM R1「我的盤」儲存）。訪客模式：localStorage 暫存。
      partialize: (s) => ({ people: s.people, overlay: s.overlay }),
    }
  )
);
