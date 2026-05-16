'use client';

import { useEffect, useRef } from 'react';
import { variations } from '@/lib/variations';
import { useHeroStore } from '@/lib/store';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

// Ring geometry — cards sit along an arched dome at the bottom of the hero.
// Total swept angle as we scroll from v0 to v4 is (N-1) * STEP_DEG.
const STEP_DEG = 30;                 // angular spacing between adjacent cards
const RADIUS_X = 320;                // horizontal radius (px)
const RADIUS_Y = 110;                // vertical drop at the edges (px)
const N = variations.length;

export default function VariationCarousel() {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = useHeroStore((s) => s.activeIndex);

  // Subscribe to scrollProgress imperatively so we don't re-render React
  // on every scroll tick — we mutate transforms directly on refs.
  useEffect(() => {
    const apply = (progress: number) => {
      const ringAngle = progress * (N - 1) * STEP_DEG; // 0..120deg

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const cardDeg = i * STEP_DEG - ringAngle;
        const rad = (cardDeg * Math.PI) / 180;

        const x = Math.sin(rad) * RADIUS_X;
        const y = (1 - Math.cos(rad)) * RADIUS_Y;

        const absDeg = Math.abs(cardDeg);
        const scale = Math.max(0.55, 1 - absDeg / 90);
        const opacity = Math.max(0.18, 1 - absDeg / 80);

        el.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(100 - Math.round(absDeg));
      });
    };

    // Apply initial state.
    apply(useHeroStore.getState().scrollProgress);

    // Subscribe to future progress changes.
    const unsub = useHeroStore.subscribe((state, prev) => {
      if (state.scrollProgress !== prev.scrollProgress) {
        apply(state.scrollProgress);
      }
    });

    return unsub;
  }, []);

  const handleCardClick = (index: number) => {
    const target = window.innerHeight * index;
    gsap.to(window, {
      scrollTo: target,
      duration: 0.9,
      ease: 'power3.inOut',
    });
  };

  return (
    <div className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="relative" style={{ width: '720px', height: '180px' }}>
        {/* Dashed arc baseline */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: 0, top: 30, width: '720px', height: '130px' }}
          viewBox="0 0 720 130"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 30 110 Q 360 -30 690 110"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="2 5"
          />
        </svg>

        {variations.map((variation, idx) => {
          const isActive = idx === activeIndex;

          return (
            <button
              key={variation.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onClick={() => handleCardClick(idx)}
              aria-pressed={isActive}
              aria-label={`${variation.name} colorway`}
              className="absolute top-0 left-1/2 pointer-events-auto group"
              style={{
                // x/y/scale are applied imperatively in the scroll subscriber.
                transform: 'translate(-50%, 0)',
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  background: `radial-gradient(circle at 30% 25%, ${variation.glow}66, ${variation.bgMid} 60%, ${variation.bgDeep})`,
                  border: isActive
                    ? `1.5px solid ${variation.glow}`
                    : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isActive
                    ? `0 0 0 4px ${variation.glow}22, 0 0 32px ${variation.glow}99, 0 12px 30px rgba(0,0,0,0.6)`
                    : '0 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                  transition:
                    'box-shadow 0.35s ease, border-color 0.35s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: `1px solid ${variation.glow}40`,
                    background: `radial-gradient(circle at 35% 30%, ${variation.glow}55, transparent 65%)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '14%',
                    left: '22%',
                    width: '22%',
                    height: '12%',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(ellipse, rgba(255,255,255,0.65), transparent 70%)',
                    filter: 'blur(2px)',
                  }}
                />
              </div>

              {isActive && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 font-mono-spec mt-3 whitespace-nowrap"
                  style={{ color: variation.glow, fontSize: '0.6rem' }}
                >
                  0{idx + 1} · {variation.name.split(' ')[0].toUpperCase()}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
