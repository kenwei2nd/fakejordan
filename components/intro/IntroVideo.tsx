'use client';

import { useEffect, useRef } from 'react';

export default function IntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const h = section.offsetHeight || window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / h));

      const HOLD = 0.35;
      const opacity =
        progress <= HOLD ? 1 : Math.max(0, 1 - (progress - HOLD) / (1 - HOLD));
      const scale = 1 + progress * 0.08;
      const blur = progress <= HOLD ? 0 : (progress - HOLD) * 8;

      overlay.style.opacity = String(opacity);
      overlay.style.transform = `scale(${scale})`;
      overlay.style.filter = `blur(${blur}px)`;
      overlay.style.pointerEvents = opacity < 0.05 ? 'none' : 'none';
      overlay.style.visibility = progress >= 1 ? 'hidden' : 'visible';
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Intro"
      style={{ position: 'relative', height: '100vh', width: '100%' }}
    >
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          pointerEvents: 'none',
          background: '#000',
          willChange: 'opacity, transform, filter',
          transformOrigin: 'center center',
        }}
      >
        <video
          ref={videoRef}
          src="/intro.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </section>
  );
}
