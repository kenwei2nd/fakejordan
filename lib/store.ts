import { create } from 'zustand';

interface HeroStore {
  activeIndex: number;
  scrollProgress: number;
  scrollDirection: 'up' | 'down' | null;
  techProgress: number; // 0..1 reveal timeline (lines + label slide-in)
  techHandoffComplete: boolean; // shared-element morph has landed → play video
  setActiveIndex: (index: number) => void;
  setScrollProgress: (progress: number) => void;
  setScrollDirection: (direction: 'up' | 'down' | null) => void;
  setTechProgress: (progress: number) => void;
  setTechHandoffComplete: (v: boolean) => void;
}

export const useHeroStore = create<HeroStore>((set) => ({
  activeIndex: 0,
  scrollProgress: 0,
  scrollDirection: null,
  techProgress: 0,
  techHandoffComplete: false,
  setActiveIndex: (index) => set({ activeIndex: index }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setScrollDirection: (direction) => set({ scrollDirection: direction }),
  setTechProgress: (progress) => set({ techProgress: progress }),
  setTechHandoffComplete: (v) => set({ techHandoffComplete: v }),
}));
