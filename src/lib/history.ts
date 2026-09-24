import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== newItem.id);
          return { items: [newItem, ...filtered].slice(0, 20) };
        });
      },
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'amazon-history-storage',
    }
  )
);
