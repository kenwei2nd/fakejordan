'use client';

import { RefObject, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fires `build(tl)` once, then plays the timeline when the section enters
 * the viewport and reverses it when it leaves from the top.
 */
export function useSectionReveal(
  ref: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline) => void
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ paused: true });
    build(tl);
    tlRef.current = tl;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
