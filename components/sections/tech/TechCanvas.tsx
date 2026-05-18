'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHeroStore } from '@/lib/store';

// After the video reaches its final frame, this tween advances techProgress
// 0 → 1, which TechLabels consumes to draw the lines + slide the monospace
// callouts in.
const REVEAL_DURATION = 1.2;
// Fire the label reveal slightly before the video actually ends so the line
// draw kisses the final frame instead of arriving a beat late.
const REVEAL_LEAD = 0.18; // seconds before video duration
// Tiny pause after the hard swap before the explosion begins, so the user
// registers the shoe's arrival.
const PLAY_DELAY_MS = 300;

export default function TechCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const playTimerRef = useRef<number | null>(null);
  const revealedRef = useRef(false);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setP = (v: number) => useHeroStore.getState().setTechProgress(v);

    const startReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      tweenRef.current?.kill();
      const obj = { p: 0 };
      setP(0);
      tweenRef.current = gsap.to(obj, {
        p: 1,
        duration: REVEAL_DURATION,
        ease: 'power2.out',
        onUpdate: () => setP(obj.p),
      });
    };

    const play = () => {
      // Cancel any leftover timers / tweens from previous cycles.
      if (playTimerRef.current !== null) {
        window.clearTimeout(playTimerRef.current);
      }
      tweenRef.current?.kill();
      revealedRef.current = false;
      setP(0);

      // Hard swap: video becomes opaque the instant the handoff fires.
      video.style.opacity = '1';
      try {
        video.currentTime = 0;
      } catch {}

      // Brief pause before the explosion plays.
      playTimerRef.current = window.setTimeout(() => {
        playTimerRef.current = null;
        void video.play().catch(() => {});
      }, PLAY_DELAY_MS);
    };

    const reset = () => {
      if (playTimerRef.current !== null) {
        window.clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      tweenRef.current?.kill();
      revealedRef.current = false;
      setP(0);
      // Hard swap (reverse): video is hidden again so the bridge shoe owns
      // the screen if the user scrolls back up.
      video.style.opacity = '0';
      try {
        video.pause();
        video.currentTime = 0;
      } catch {}
    };

    const onTimeUpdate = () => {
      if (revealedRef.current) return;
      const d = video.duration;
      if (Number.isFinite(d) && d > 0 && video.currentTime >= d - REVEAL_LEAD) {
        startReveal();
      }
    };
    const onEnded = () => startReveal();

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    // React to the shared-element handoff signal driven by TechCarryForward.
    // Edge-triggered on transitions, plus an initial check in case the page
    // loaded straight into the tech section already.
    let prevHandoff = useHeroStore.getState().techHandoffComplete;
    if (prevHandoff) play();
    const unsubscribe = useHeroStore.subscribe((s) => {
      if (s.techHandoffComplete !== prevHandoff) {
        prevHandoff = s.techHandoffComplete;
        if (s.techHandoffComplete) play();
        else reset();
      }
    });

    return () => {
      tweenRef.current?.kill();
      if (playTimerRef.current !== null) {
        window.clearTimeout(playTimerRef.current);
      }
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      unsubscribe();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      data-tech-video
      src="/tech/explode.mp4"
      muted
      playsInline
      preload="auto"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        zIndex: 2,
        opacity: 0,
        WebkitMaskImage:
          'radial-gradient(ellipse 70% 78% at center, black 55%, transparent 100%)',
        maskImage:
          'radial-gradient(ellipse 70% 78% at center, black 55%, transparent 100%)',
      }}
    />
  );
}
