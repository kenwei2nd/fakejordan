import { create } from 'zustand';

interface HeroStore {
  activeIndex: number;
  scrollProgress: number;
  scrollDirection: 'up' | 'down' | null;
  setActiveIndex: (index: number) => void;
  setScrollProgress: (progress: number) => void;
  setScrollDirection: (direction: 'up' | 'down' | null) => void;
}

export const useHeroStore = create<HeroStore>((set) => ({
  activeIndex: 0,
  scrollProgress: 0,
  scrollDirection: null,
  setActiveIndex: (index) => set({ activeIndex: index }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setScrollDirection: (direction) => set({ scrollDirection: direction }),
}));
