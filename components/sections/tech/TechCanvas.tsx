'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHeroStore } from '@/lib/store';

// Once the shoe-split video finishes, this tween advances techProgress 0 → 1,
// which TechLabels consumes to draw lines + slide labels in.
const REVEAL_DURATION = 1.2;
// Fire the reveal slightly before the video actually ends so the line draw
// kisses the final frame instead of arriving a beat late.
const REVEAL_LEAD = 0.18; // seconds before duration

export default function TechCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
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

    let playTimer: number | undefined;
    const play = () => {
      revealedRef.current = false;
      tweenRef.current?.kill();
      setP(0);
      try {
        video.currentTime = 0;
      } catch {}
      // 200ms grace after the hard swap so the bridge fade-out and the
      // video appearance read as one beat.
      if (playTimer) window.clearTimeout(playTimer);
      playTimer = window.setTimeout(() => {
        void video.play().catch(() => {});
      }, 200);
    };

    const reset = () => {
      tweenRef.current?.kill();
      if (playTimer) window.clearTimeout(playTimer);
      revealedRef.current = false;
      setP(0);
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

    // Play / reset based on the shared-element handoff signal driven by
    // TechCarryForward. Edge-triggered on transitions, plus an initial check
    // in case the page loaded straight into the tech section already.
    let prevHandoff = useHeroStore.getState().techHandoffComplete;
    if (prevHandoff) play();
    const unsubscribe = useHeroStore.subscribe((s) => {
      if (s.techHandoffComplete !== prevHandoff) {
        prevHandoff = s.techHandoffComplete;
        if (s.techHandoffComplete) play();
        else reset();
      }
    });

    // Soft pause used by the reverse breakout — TechCarryForward will
    // smoothly un-play the video and un-reveal the labels itself, so we
    // need to STOP our own tweens / playback without zeroing the values
    // (which is what reset() does).
    const onCancelReveal = () => {
      tweenRef.current?.kill();
      if (playTimer) window.clearTimeout(playTimer);
      try {
        video.pause();
      } catch {}
      // Allow the next forward handoff to re-trigger play().
      revealedRef.current = false;
    };
    window.addEventListener('tech-reveal-cancel', onCancelReveal);

    return () => {
      tweenRef.current?.kill();
      if (playTimer) window.clearTimeout(playTimer);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      window.removeEventListener('tech-reveal-cancel', onCancelReveal);
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
        WebkitMaskImage:
          'radial-gradient(ellipse 70% 78% at center, black 55%, transparent 100%)',
        maskImage:
          'radial-gradient(ellipse 70% 78% at center, black 55%, transparent 100%)',
      }}
    />
  );
}
