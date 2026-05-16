'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { variations } from '@/lib/variations';
import { useHeroStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export function useHeroScrollTimeline() {
  useLayoutEffect(() => {
    const heroScroll = document.getElementById('hero-scroll');
    if (!heroScroll) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Stack all sneakers offset; only #0 visible at progress 0.
    gsap.set('[data-sneaker]', { x: 80, opacity: 0, rotateZ: 6, scale: 0.94 });
    gsap.set('[data-sneaker="0"]', { x: 0, opacity: 1, rotateZ: 0, scale: 1 });

    const N = variations.length;             // 5
    const SEG = 1 / (N - 1);                 // 0.25 — segment width in timeline units

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroScroll,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        // No snap here — useHeroWheelSnap owns discrete stepping. The scrub
        // smoothly interpolates the visuals while gsap.scrollTo animates
        // window.scrollY between snap points.
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (N - 1));
          const velocity = self.getVelocity();
          const direction =
            velocity > 1 ? 'down' : velocity < -1 ? 'up' : null;
          useHeroStore.setState({
            activeIndex: idx,
            scrollProgress: self.progress,
            scrollDirection: direction,
          });
        },
      },
      defaults: { ease: 'power1.inOut' },
    });

    // Anchor the timeline at 0 with the first variation's tokens (zero-duration set).
    const v0 = variations[0];
    tl.set(':root', {
      '--bg-deep': v0.bgDeep,
      '--bg-mid': v0.bgMid,
      '--glow': v0.glow,
      '--ring-angle': '0deg',
    }, 0);

    // For each adjacent pair, build one segment of length SEG that:
    //  - tweens bg tokens + ring angle across the full segment,
    //  - fades the previous sneaker out in the first half,
    //  - fades the next sneaker in during the second half.
    for (let i = 1; i < N; i++) {
      const segStart = (i - 1) * SEG;
      const variation = variations[i];

      // Background + ring angle: full-segment tween.
      tl.to(':root', {
        '--bg-deep': variation.bgDeep,
        '--bg-mid': variation.bgMid,
        '--glow': variation.glow,
        '--ring-angle': `${i * (360 / N)}deg`,
        duration: SEG,
      }, segStart);

      // Outgoing sneaker fades in first 60% of segment.
      tl.to(`[data-sneaker="${i - 1}"]`, {
        x: -80,
        rotateZ: -6,
        scale: 0.94,
        opacity: 0,
        duration: SEG * 0.6,
      }, segStart);

      // Incoming sneaker enters from offset in last 60% of segment (overlap 20%).
      tl.fromTo(
        `[data-sneaker="${i}"]`,
        { x: 80, rotateZ: 6, scale: 0.94, opacity: 0 },
        {
          x: 0,
          rotateZ: 0,
          scale: 1,
          opacity: 1,
          duration: SEG * 0.6,
        },
        segStart + SEG * 0.4
      );
    }

    // Normalize so timeline progress == scroll progress 0..1.
    tl.totalDuration(1);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);
}
