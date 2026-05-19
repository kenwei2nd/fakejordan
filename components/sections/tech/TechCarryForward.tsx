'use client';

import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { useHeroStore } from '@/lib/store';
import { variations } from '@/lib/variations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
}

// ─────────────────────────────────────────────────────────────────────────
// Z-Axis Breakout — sequenced (not scroll-scrubbed).
//
// Wheel-snap dispatches `tech-breakout-play` when user wheels across the
// snap-5 ↔ snap-6 boundary. We own a GSAP timeline that runs in TWO
// distinct phases:
//
//   PHASE A — "shoe takes off"  (page scroll LOCKED at snap 5 / snap 6)
//     • Hero stage fades out
//     • Bridge shoe pops in at scale 1, then scales up to peak 4.0
//     • Blur 0 → 3px, drop-shadow intensifies
//     • Apex hold so the eye registers it
//
//   PHASE B — "world catches up"  (scroll begins)
//     • Page scrollTo target snap point (0.7s, power2.inOut)
//     • Simultaneously shoe lands: scale 4.0 → 0.55, blur back to 0
//     • Once landed, opacity 1 → 0 (the swap)
//     • Handoff fires → TechCanvas starts video after its own 200ms beat
//
// Total ≈ 1.55s. Reverse direction (snap 6 → 5) plays the same arcs but
// terminates with the hero stage restored and the handoff cleared.
// ─────────────────────────────────────────────────────────────────────────

const HERO_VH = 5.0;
const TECH_VH = 6.0;

// Numeric shoe state — tweened by GSAP, applied imperatively each frame.
type ShoeState = {
  scale: number;
  blur: number;
  opacity: number;
  yVh: number;       // vertical offset in viewport-heights
  shadowT: number;   // 0 = shallow, 1 = deep (drives drop-shadow params)
};

const STATE_HERO_HIDDEN: ShoeState  = { scale: 1.00, blur: 0, opacity: 0, yVh: -4, shadowT: 0 };
const STATE_APEX: ShoeState         = { scale: 4.00, blur: 0, opacity: 1, yVh: -3, shadowT: 1 };
const STATE_LANDED: ShoeState       = { scale: 0.55, blur: 0, opacity: 1, yVh:  0, shadowT: 0 };
const STATE_GONE: ShoeState         = { scale: 0.55, blur: 0, opacity: 0, yVh:  0, shadowT: 0 };

// Phase durations
const PHASE_A_FLYOUT = 0.65;
const PHASE_A_HOLD   = 0.25;
const PHASE_B_SCROLL = 0.65;
const PHASE_B_LAND   = 0.50;
const PHASE_B_SWAP   = 0.15;

// Reverse-only prelude: smoothly un-reveal labels and rewind the video
// BEFORE the z-axis breakout runs in reverse, so the whole forward
// sequence is properly inverted instead of snapping to its initial state.
const PHASE_0_REVERT = 0.55;

export default function TechCarryForward({ triggerRef: _ }: Props) {
  const shoeRef = useRef<HTMLImageElement>(null);
  const stateRef = useRef<ShoeState>({ ...STATE_HERO_HIDDEN });
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Imperative style writer — called from every timeline tick.
  const applyShoeStyles = () => {
    const shoe = shoeRef.current;
    if (!shoe) return;
    const s = stateRef.current;
    shoe.style.transform =
      `translate3d(-50%, calc(-50% + ${s.yVh}vh), 0) scale(${s.scale})`;
    shoe.style.opacity = String(s.opacity);
    const shadowBlur = 30 + s.shadowT * 70;     // 30 → 100 px
    const shadowOffsetY = 30 + s.shadowT * 50;  // 30 → 80 px
    const shadowAlpha = 0.55 + s.shadowT * 0.25; // 0.55 → 0.80
    shoe.style.filter =
      `drop-shadow(0 ${shadowOffsetY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})) ` +
      `blur(${s.blur}px)`;
  };

  // Keep the bridge shoe's image src in sync with the active hero variation.
  useEffect(() => {
    const shoe = shoeRef.current;
    if (!shoe) return;
    const sync = () => {
      const i = Math.min(
        Math.max(useHeroStore.getState().activeIndex, 0),
        variations.length - 1,
      );
      shoe.src = variations[i].image;
    };
    sync();
    let prev = useHeroStore.getState().activeIndex;
    return useHeroStore.subscribe((s) => {
      if (s.activeIndex !== prev) {
        prev = s.activeIndex;
        sync();
      }
    });
  }, []);

  // Settle state from scroll position when no timeline is active — handles
  // page refresh mid-section, scrollbar drag, keyboard scroll, etc.
  useLayoutEffect(() => {
    const heroStage = document.querySelector<HTMLElement>('[data-sneaker-stage]');

    const settle = () => {
      if (tlRef.current?.isActive()) return; // timeline owns the state
      const sy = window.scrollY / window.innerHeight;
      const store = useHeroStore.getState();
      if (sy < (HERO_VH + TECH_VH) / 2) {
        Object.assign(stateRef.current, STATE_HERO_HIDDEN);
        if (heroStage) heroStage.style.opacity = '';
        if (store.techHandoffComplete) store.setTechHandoffComplete(false);
      } else {
        Object.assign(stateRef.current, STATE_GONE);
        if (heroStage) heroStage.style.opacity = '0';
        if (!store.techHandoffComplete) store.setTechHandoffComplete(true);
      }
      applyShoeStyles();
    };

    settle();
    window.addEventListener('scroll', settle, { passive: true });
    return () => {
      window.removeEventListener('scroll', settle);
      if (heroStage) heroStage.style.opacity = '';
    };
  }, []);

  // Main event handler: wheel-snap dispatches → we play the timeline.
  useLayoutEffect(() => {
    const heroStage = document.querySelector<HTMLElement>('[data-sneaker-stage]');

    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ dir: 1 | -1 }>;
      const dir = e.detail.dir;
      tlRef.current?.kill();

      const vh = window.innerHeight;
      const targetScroll = dir === 1 ? TECH_VH * vh : HERO_VH * vh;
      const store = useHeroStore.getState();

      // Snap state to the visual starting point for this direction.
      const startState: ShoeState =
        dir === 1 ? { ...STATE_HERO_HIDDEN } : { ...STATE_GONE };
      Object.assign(stateRef.current, startState);
      applyShoeStyles();

      // Forward: pre-clear handoff so the video doesn't trigger before the
      // shoe lands. Reverse: DO NOT clear handoff here — that would call
      // TechCanvas.reset() and instantly zero techProgress + currentTime.
      // We'll clear it at the very end, after Phase 0 has smoothly
      // un-played the video and un-revealed the labels.
      if (dir === 1 && store.techHandoffComplete) {
        store.setTechHandoffComplete(false);
      }
      // Reverse-only: tell TechCanvas to stop its own tweens/playback
      // without touching the values — we own the rewind from here.
      if (dir === -1) {
        window.dispatchEvent(new Event('tech-reveal-cancel'));
      }

      const state = stateRef.current;
      const tl = gsap.timeline({ onUpdate: applyShoeStyles });

      // ── REVERSE PHASE 0 — un-reveal labels + rewind video ──────────
      // Page is locked. techProgress 1 → 0 collapses leader lines and
      // slides labels back out. Video.currentTime → 0 re-assembles the
      // shoe layer by layer. Runs in parallel.
      if (dir === -1) {
        const techStore = useHeroStore.getState();
        const progressProxy = { p: techStore.techProgress };
        tl.to(progressProxy, {
          p: 0,
          duration: PHASE_0_REVERT,
          ease: 'power2.inOut',
          onUpdate: () => {
            useHeroStore.getState().setTechProgress(progressProxy.p);
          },
        }, 0);

        const video = document.querySelector<HTMLVideoElement>('[data-tech-video]');
        if (video) {
          try { video.pause(); } catch {}
          const d = video.duration;
          const startT = Number.isFinite(d) && d > 0 ? video.currentTime : 0;
          if (startT > 0) {
            const videoProxy = { t: startT };
            tl.to(videoProxy, {
              t: 0,
              duration: PHASE_0_REVERT,
              ease: 'power2.inOut',
              onUpdate: () => {
                try { video.currentTime = videoProxy.t; } catch {}
              },
            }, 0);
          }
        }
      }

      // Phase A starts after Phase 0 in reverse, immediately in forward.
      const phaseAStart = dir === -1 ? PHASE_0_REVERT : 0;

      // PHASE A — page locked. Shoe pops in and inflates to apex.
      tl.to(state, {
        ...STATE_APEX,
        duration: PHASE_A_FLYOUT,
        ease: 'power2.out',
      }, phaseAStart);

      // Parallel: fade hero stage out (forward) or in (reverse) during fly-out.
      if (heroStage) {
        const heroProxy = { o: dir === 1 ? 1 : 0 };
        heroStage.style.opacity = String(heroProxy.o);
        tl.to(heroProxy, {
          o: dir === 1 ? 0 : 1,
          duration: PHASE_A_FLYOUT,
          ease: 'power2.out',
          onUpdate: () => {
            if (dir === -1 && heroProxy.o >= 0.999) {
              heroStage.style.opacity = ''; // restore stylesheet default
            } else {
              heroStage.style.opacity = String(heroProxy.o);
            }
          },
        }, phaseAStart);
      }

      // Apex hold — eye registers the moment.
      tl.to(state, { duration: PHASE_A_HOLD }, '>');

      // PHASE B — page scrolls AND shoe lands (overlapped).
      tl.to(window, {
        scrollTo: targetScroll,
        duration: PHASE_B_SCROLL,
        ease: 'power2.inOut',
      }, '>');

      const landTarget: ShoeState =
        dir === 1
          ? { ...STATE_LANDED }
          : { ...STATE_HERO_HIDDEN, opacity: 1 };
      tl.to(state, {
        ...landTarget,
        duration: PHASE_B_LAND,
        ease: 'power3.in',
      }, '<');

      // The swap: opacity to 0 once landed.
      tl.to(state, {
        opacity: 0,
        duration: PHASE_B_SWAP,
        ease: 'power2.out',
        onComplete: () => {
          // Final commit at the end of the sequence.
          if (dir === 1) {
            Object.assign(stateRef.current, STATE_GONE);
            if (heroStage) heroStage.style.opacity = '0';
            useHeroStore.getState().setTechHandoffComplete(true);
          } else {
            Object.assign(stateRef.current, STATE_HERO_HIDDEN);
            if (heroStage) heroStage.style.opacity = '';
            useHeroStore.getState().setTechHandoffComplete(false);
          }
          applyShoeStyles();
        },
      }, '>');

      tlRef.current = tl;
    };

    window.addEventListener('tech-breakout-play', handler);
    return () => {
      window.removeEventListener('tech-breakout-play', handler);
      tlRef.current?.kill();
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
        transform: 'translate3d(-50%, calc(-50% - 4vh), 0) scale(1)',
        transformOrigin: 'center center',
        width: 'clamp(420px, 62vw, 950px)',
        height: 'auto',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 50,
        willChange: 'transform, opacity, filter',
        filter: 'drop-shadow(0 30px 30px rgba(0, 0, 0, 0.55))',
      }}
    />
  );
}
