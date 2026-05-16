'use client';

import Image from 'next/image';
import { variations } from '@/lib/variations';

export default function SneakerStage() {
  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none"
      style={{ perspective: '1600px' }}
    >
      {variations.map((variation, idx) => {
        return (
          // OUTER wrapper: fills viewport, flex-centers the image.
          // GSAP fully owns opacity + transform on this wrapper —
          // flex keeps the image centered regardless of GSAP's transform.
          <div
            key={variation.id}
            data-sneaker={idx}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {/* Inner stack: glow halo, sneaker, floor reflection */}
            <div
              className="relative flex items-center justify-center"
              style={{ transform: 'translateY(-4vh)' }}
            >
              {/* Glow halo behind sneaker */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 'clamp(420px, 60vw, 1000px)',
                  height: 'clamp(300px, 42vw, 700px)',
                  background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${variation.glow}55, transparent 70%)`,
                  filter: 'blur(50px)',
                  zIndex: -1,
                }}
              />

              {/* Sneaker image — kept crisp: NO filter chain on the image,
                  NO 3D transforms on it. Depth comes from sibling glow + floor
                  reflection (positioned behind/under via z-index). */}
              <Image
                src={variation.image}
                alt={variation.name}
                width={1400}
                height={1400}
                priority
                quality={95}
                sizes="(max-width: 768px) 90vw, 65vw"
                style={{
                  width: 'clamp(420px, 62vw, 950px)',
                  height: 'auto',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  // Single sharp shadow underneath — no halo blur on the image itself.
                  filter: `drop-shadow(0 30px 30px rgba(0, 0, 0, 0.55))`,
                }}
              />

              {/* Floor reflection */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: '-8vh',
                  width: 'clamp(320px, 46vw, 720px)',
                  height: 'clamp(40px, 7vh, 90px)',
                  background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${variation.glow}40, rgba(0,0,0,0.7) 35%, transparent 75%)`,
                  filter: 'blur(14px)',
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
