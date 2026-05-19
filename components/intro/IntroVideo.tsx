'use client';

import { useEffect, useRef } from 'react';

// Reveal the hero-poster titles this many seconds before the video ends so
// the typography arrives WITH the cinematic final frame, not after it.
const TITLES_REVEAL_LEAD = 1.6;

export default function IntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);

  // Scroll-driven overlay fade/scale/blur (unchanged).
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

  // Reveal titles in the last ~1.6s of playback (or on `ended`, whichever
  // fires first). `revealed` ref gates against double-fire.
  useEffect(() => {
    const video = videoRef.current;
    const titles = titlesRef.current;
    if (!video || !titles) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      titles.classList.add('intro-titles-on');
    };

    const onTimeUpdate = () => {
      if (revealed) return;
      const d = video.duration;
      if (Number.isFinite(d) && d > 0 && video.currentTime >= d - TITLES_REVEAL_LEAD) {
        reveal();
      }
    };
    const onEnded = () => reveal();

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
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
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Hero-poster title overlay — magazine-cover layout that fades in
            during the final 1.6s of the video and persists on the freeze. */}
        <div
          ref={titlesRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* TOP-LEFT — brand mark */}
          <div
            className="intro-title-block"
            style={{
              position: 'absolute',
              top: 'clamp(24px, 4vh, 40px)',
              left: 'clamp(24px, 4vw, 48px)',
              animationDelay: '0s',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ff2d3a',
                display: 'inline-block',
                marginRight: 10,
                verticalAlign: 'middle',
                boxShadow: '0 0 12px rgba(255, 45, 58, 0.7)',
              }}
            />
            <span
              className="font-mono-spec"
              style={{
                color: '#ffffff',
                letterSpacing: '0.34em',
                fontSize: '0.72rem',
                verticalAlign: 'middle',
              }}
            >
              FakeJordan
            </span>
          </div>

          {/* TOP-RIGHT — drop badge */}
          <div
            className="intro-title-block font-mono-spec"
            style={{
              position: 'absolute',
              top: 'clamp(24px, 4vh, 40px)',
              right: 'clamp(24px, 4vw, 48px)',
              color: 'rgba(255, 255, 255, 0.55)',
              fontSize: '0.7rem',
              letterSpacing: '0.28em',
              animationDelay: '0.05s',
            }}
          >
            DROP 026 · SS25
          </div>

          {/* BOTTOM-LEFT — hero title block */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(48px, 9vh, 110px)',
              left: 'clamp(28px, 5vw, 64px)',
              maxWidth: 'min(72vw, 760px)',
            }}
          >
            <div
              className="intro-title-block font-mono-spec"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.72rem',
                letterSpacing: '0.32em',
                marginBottom: 16,
                animationDelay: '0.20s',
              }}
            >
              INTRODUCING
            </div>
            <h1
              className="intro-title-block font-display"
              style={{
                fontSize: 'clamp(4rem, 9vw, 9rem)',
                color: '#ffffff',
                lineHeight: 0.9,
                letterSpacing: '-0.035em',
                marginBottom: 22,
                animationDelay: '0.30s',
                textShadow: '0 2px 24px rgba(0, 0, 0, 0.5)',
              }}
            >
              THE AR4.
            </h1>
            <p
              className="intro-title-block"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '34ch',
                lineHeight: 1.4,
                animationDelay: '0.50s',
                textShadow: '0 1px 12px rgba(0, 0, 0, 0.6)',
              }}
            >
              Built for the blacktop.
            </p>
          </div>

          {/* BOTTOM-RIGHT — meta + scroll cue */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(48px, 9vh, 110px)',
              right: 'clamp(28px, 5vw, 64px)',
              textAlign: 'right',
            }}
          >
            <div
              className="intro-title-block font-mono-spec"
              style={{
                color: 'rgba(255, 255, 255, 0.45)',
                fontSize: '0.68rem',
                letterSpacing: '0.26em',
                lineHeight: 1.7,
                marginBottom: 14,
                animationDelay: '0.65s',
              }}
            >
              Five colorways.
              <br />
              One silhouette.
            </div>
            <div
              className="intro-title-block font-mono-spec"
              style={{
                color: '#ff2d3a',
                fontSize: '0.72rem',
                letterSpacing: '0.26em',
                animationDelay: '0.80s',
                textShadow: '0 0 16px rgba(255, 45, 58, 0.5)',
              }}
            >
              <span className="intro-cue-arrow">▼</span>{'  '}Pick yours
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
