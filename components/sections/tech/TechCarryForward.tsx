'use client';

import { RefObject, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useHeroStore } from '@/lib/store';
import { variations } from '@/lib/variations';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
}

// All thresholds are in viewport-heights of document scroll.
//
//   4.5 → 5.3    Hero stage fades out.
//   5.0 → 5.5    Bridge shoe fades in over the dying hero (full size).
//   5.5 → 8.0    SLOW MORPH — bridge shoe scales 1 → SHOE_END_SCALE over
//                250vh of scroll, while the Showcase Card naturally slides
//                up from below the viewport (free effect — Tech's sticky
//                stage isn't pinned yet, its content is at offset 200vh).
//   8.0          HARD SWAP. Bridge shoe and the video are still siblings
//                stacked in the same screen position; we flip their
//                opacities atomically: bridge → 0, video → 1. The video is
//                kept at opacity 0 for the entire scroll up until this
//                instant, so no ghosting occurs during the morph.
//   8.0 + 300ms  TechCanvas calls video.play() (slight pause so the user
//                registers the arrival before the explosion begins).
//
// Tech section's sticky stage engages at scrollY = 8.0vh and stays pinned
// from 8.0 → 10.0vh, releasing into Materials at scroll 11.0vh.
const HERO_FADE_START = 4.5;
const HERO_FADE_END = 5.3;
const BRIDGE_FADE_IN_START = 5.0;
const BRIDGE_FADE_IN_END = 5.5;
const SCALE_START = 5.5;
const SCALE_END = 8.0;
const HANDOFF_AT = 8.0;

// Final scale of the bridge shoe at the moment of the hard swap. Tune to
// match the shoe size inside the first frame of /tech/explode.mp4.
const SHOE_END_SCALE = 0.45;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function TechCarryForward({ triggerRef: _ }: Props) {
  const shoeRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const shoe = shoeRef.current;
    if (!shoe) return;
    const heroStage = document.querySelector<HTMLElement>('[data-sneaker-stage]');

    let lastIdx = -1;

    const apply = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY / vh;
      const store = useHeroStore.getState();

      // Sync clone src to whichever colorway is on-screen in the hero.
      const idx = Math.min(Math.max(store.activeIndex, 0), variations.length - 1);
      if (idx !== lastIdx) {
        shoe.src = variations[idx].image;
        lastIdx = idx;
      }

      // Hero stage fade.
      const heroT = clamp01((sy - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START));
      if (heroStage) heroStage.style.opacity = String(1 - smoothstep(heroT));

      // Hard handoff state — single source of truth.
      const past = sy >= HANDOFF_AT;

      // Bridge shoe opacity: fade-in to 1, hold at 1 through the morph,
      // then INSTANT 0 once we cross HANDOFF_AT (no crossfade).
      const fadeInT = clamp01(
        (sy - BRIDGE_FADE_IN_START) / (BRIDGE_FADE_IN_END - BRIDGE_FADE_IN_START),
      );
      const bridgeOpacity = past ? 0 : smoothstep(fadeInT);

      // Slow scale tween — finishes EXACTLY when handoff fires so the shoe
      // is at rest before the swap, not still moving.
      const scaleT = clamp01((sy - SCALE_START) / (SCALE_END - SCALE_START));
      const scale = lerp(1, SHOE_END_SCALE, smoothstep(scaleT));

      shoe.style.opacity = String(bridgeOpacity);
      shoe.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;

      // Flip handoff state.
      if (past !== store.techHandoffComplete) {
        store.setTechHandoffComplete(past);
      }
    };

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'max',
      onUpdate: apply,
      onRefresh: apply,
    });
    apply();

    return () => {
      st.kill();
      if (heroStage) heroStage.style.opacity = '';
    };
  }, []);

  return (
    <img
      ref={shoeRef}
      src={variations[0].image}
      alt=""
      aria-hidden
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate3d(-50%, -50%, 0) scale(1)',
        transformOrigin: 'center center',
        width: 'clamp(420px, 62vw, 950px)',
        height: 'auto',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 50,
        willChange: 'transform, opacity',
        filter: 'drop-shadow(0 30px 30px rgba(0, 0, 0, 0.55))',
      }}
    />
  );
}
