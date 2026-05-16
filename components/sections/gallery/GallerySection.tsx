'use client';

import { useRef } from 'react';
import Image from 'next/image';
import SectionWrapper from '../SectionWrapper';
import { sections } from '@/lib/sections';
import { useSectionReveal } from '@/hooks/useSectionReveal';

const meta = sections.find((s) => s.id === 'gallery')!;

const PANELS = [
  {
    src: '/lifestyle/gallery-red.png',
    caption: 'CRIMSON STRIKE',
    sub: 'Court Ready — Street Verified',
    align: 'bottom-left',
  },
  {
    src: '/lifestyle/gallery-all.png',
    caption: 'ALL 5 COLORWAYS',
    sub: 'One silhouette. Five worlds.',
    align: 'top-right',
  },
  {
    src: '/lifestyle/gallery-blue.png',
    caption: 'MIDNIGHT COURT',
    sub: 'Cold-pressed. Drop-ready.',
    align: 'bottom-right',
  },
];

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.gallery-panel',
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.8,
        ease: 'power3.inOut',
        stagger: 0.15,
      }
    ).fromTo(
      '.gallery-caption',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
      '-=0.4'
    ).fromTo(
      '.gallery-heading',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0
    );
  });

  return (
    <SectionWrapper
      id={meta.id}
      bg={meta.bg}
      glow={meta.glow}
      label={meta.label}
      title={meta.title}
    >
      <div ref={ref} className="flex flex-col h-full">
        {/* Top label bar */}
        <div
          className="gallery-heading flex items-center justify-between px-10 py-6 shrink-0"
          style={{ opacity: 0 }}
        >
          <div>
            <div className="font-mono-spec text-white/30 mb-1">Editorial / AR4</div>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(1.5rem, 2.8vw, 3rem)', color: '#fff' }}
            >
              Worn. Everywhere.
            </h2>
          </div>
          <div
            className="font-mono-spec text-white/20"
            style={{ fontSize: '0.6rem', textAlign: 'right' }}
          >
            Drop 026 · Spring-Summer 2025
            <br />
            Photography by AETHER Creative
          </div>
        </div>

        {/* 3-panel grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr 1fr',
            flex: 1,
            gap: '3px',
          }}
        >
          {PANELS.map((panel) => (
            <div
              key={panel.src}
              className="gallery-panel"
              style={{
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
              }}
            >
              <Image
                src={panel.src}
                alt={panel.caption}
                fill
                sizes="33vw"
                quality={90}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />

              {/* Overlay gradient for caption legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
                }}
              />

              {/* Caption */}
              <div
                className="gallery-caption absolute px-5 pb-5"
                style={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                  opacity: 0,
                }}
              >
                <div
                  className="font-display text-white"
                  style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.1rem)', letterSpacing: '0.05em' }}
                >
                  {panel.caption}
                </div>
                <div className="font-mono-spec text-white/50" style={{ fontSize: '0.6rem', marginTop: '4px' }}>
                  {panel.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
