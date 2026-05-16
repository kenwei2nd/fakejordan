'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { variations } from '@/lib/variations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

/**
 * One wheel-tick = one full page snap. Covers:
 *   0–4  → hero colorway variations
 *   5–11 → feature sections (7 × 100vh)
 * Total: 12 discrete snap points, each at index × window.innerHeight.
 */
export function useHeroWheelSnap() {
  const animating = useRef(false);

  useEffect(() => {
    // 5 hero variations + 7 feature sections = 12 snap points (indices 0..11)
    const MAX_IDX = variations.length - 1 + 7;   // 11

    const step = (dir: 1 | -1) => {
      const vh = window.innerHeight;
      const currentIdx = Math.round(window.scrollY / vh);
      const nextIdx = currentIdx + dir;
      if (nextIdx < 0 || nextIdx > MAX_IDX) return false;

      animating.current = true;
      gsap.to(window, {
        scrollTo: nextIdx * vh,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          animating.current = false;
        },
      });
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;            // browser zoom
      if (Math.abs(e.deltaY) < 1) return;

      const vh = window.innerHeight;
      const currentIdx = Math.round(window.scrollY / vh);
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // Past the last snap point → let native scroll handle.
      if (dir === 1 && currentIdx >= MAX_IDX) return;
      if (dir === -1 && currentIdx <= 0 && window.scrollY <= 0) return;

      e.preventDefault();
      if (animating.current) return;
      step(dir);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);
}
