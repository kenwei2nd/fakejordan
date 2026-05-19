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
 *   0     → intro video
 *   1–5   → hero colorway variations
 *   6     → tech section (sequenced breakout + video + label reveal)
 *   7     → gallery (Worn. Everywhere.)
 *   8     → performance (Numbers Don't Lie.)
 * Total: 9 discrete snap points, each at index × window.innerHeight.
 */
export function useHeroWheelSnap() {
  const animating = useRef(false);

  useEffect(() => {
    // 1 intro + 5 hero variations + 3 feature sections = 9 snap points (indices 0..8)
    const MAX_IDX = variations.length + 3;   // 8

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

      // Special case: Tech-section breakout (snap 5 ↔ 6). Hand off to
      // TechCarryForward, which owns the 2-phase sequenced animation
      // (shoe flies out → page scrolls + lands). The custom event keeps
      // the wheel hook agnostic about Tech-section internals.
      if ((currentIdx === 5 && dir === 1) || (currentIdx === 6 && dir === -1)) {
        e.preventDefault();
        if (animating.current) return;
        animating.current = true;
        window.dispatchEvent(
          new CustomEvent('tech-breakout-play', { detail: { dir } }),
        );
        // Forward ≈ 1.55s, reverse ≈ 2.1s (adds Phase 0 to un-reveal
        // labels + rewind video). Use the longer figure + safety margin
        // so a fast double-wheel can't double-fire.
        const lockoutMs = dir === -1 ? 2300 : 1700;
        window.setTimeout(() => {
          animating.current = false;
        }, lockoutMs);
        return;
      }

      e.preventDefault();
      if (animating.current) return;
      step(dir);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);
}
