'use client';

import { useRef, useState } from 'react';
import SectionWrapper from '../SectionWrapper';
import CountdownTimer from './CountdownTimer';
import { sections } from '@/lib/sections';
import { variations } from '@/lib/variations';
import { useSectionReveal } from '@/hooks/useSectionReveal';

const meta = sections.find((s) => s.id === 'cta')!;

const SIZES = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.cta-drop-label',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    ).fromTo(
      '.cta-timer',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    ).fromTo(
      '.cta-divider',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: 'center' },
      '-=0.3'
    ).fromTo(
      '.cta-variation-pill',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.08 },
      '-=0.3'
    ).fromTo(
      '.cta-size-grid',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    ).fromTo(
      '.cta-bottom-row',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
  });

  const activeV = variations[selectedVariation];

  return (
    <SectionWrapper
      id={meta.id}
      bg={meta.bg}
      glow={meta.glow}
      label={meta.label}
      title={meta.title}
    >
      <div
        ref={ref}
        className="flex flex-col items-center justify-center h-full"
        style={{ padding: '6vh 8vw', gap: '3.5vh' }}
      >
        {/* Drop countdown */}
        <div className="cta-drop-label text-center" style={{ opacity: 0 }}>
          <div className="font-mono-spec text-white/30 mb-2 tracking-widest">
            DROP 026 · JUNE 14, 2026 · 12:00 UTC
          </div>
          <div
            className="font-display text-white/60"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', letterSpacing: '0.2em' }}
          >
            GLOBAL SIMULTANEOUS RELEASE
          </div>
        </div>

        <div className="cta-timer" style={{ opacity: 0 }}>
          <CountdownTimer glow={meta.glow} />
        </div>

        {/* Divider */}
        <div
          className="cta-divider h-px"
          style={{ width: '100%', maxWidth: '700px', background: 'rgba(255,255,255,0.08)', transform: 'scaleX(0)' }}
        />

        {/* Variation selector */}
        <div className="text-center">
          <div className="font-mono-spec text-white/30 mb-4" style={{ fontSize: '0.6rem' }}>
            SELECT COLORWAY — {activeV.name.toUpperCase()}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {variations.map((v, i) => (
              <button
                key={v.id}
                className="cta-variation-pill"
                onClick={() => setSelectedVariation(i)}
                aria-pressed={i === selectedVariation}
                aria-label={`${v.name} colorway`}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 30%, ${v.glow}80, ${v.bgDeep})`,
                  border: i === selectedVariation
                    ? `2px solid ${v.glow}`
                    : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: i === selectedVariation
                    ? `0 0 0 3px ${v.glow}25, 0 0 18px ${v.glow}60`
                    : 'none',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                  opacity: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Size picker */}
        <div className="cta-size-grid" style={{ opacity: 0 }}>
          <div className="font-mono-spec text-white/30 mb-3 text-center" style={{ fontSize: '0.6rem' }}>
            SELECT SIZE
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              maxWidth: '560px',
            }}
          >
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                aria-pressed={sz === selectedSize}
                className="font-mono-spec"
                style={{
                  padding: '6px 14px',
                  border: sz === selectedSize
                    ? `1px solid ${activeV.glow}`
                    : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '4px',
                  background: sz === selectedSize ? `${activeV.glow}18` : 'transparent',
                  color: sz === selectedSize ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div
          className="cta-bottom-row flex items-center gap-8"
          style={{ opacity: 0 }}
        >
          <div className="text-right">
            <div className="font-mono-spec text-white/30" style={{ fontSize: '0.58rem' }}>
              Retail Price
            </div>
            <div
              className="font-display text-white"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              $220
            </div>
          </div>

          <div className="w-px h-12 bg-white/10" />

          <button
            className="cta-primary"
            style={{
              background: selectedSize ? meta.glow : 'rgba(255,255,255,0.9)',
              color: selectedSize ? '#000' : '#000',
              boxShadow: selectedSize
                ? `0 0 30px ${meta.glow}60, 0 4px 16px rgba(0,0,0,0.4)`
                : '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {selectedSize ? `Reserve — ${selectedSize}` : 'Select a Size'}
          </button>
        </div>

        {/* Fine print */}
        <div
          className="font-mono-spec text-white/15 text-center"
          style={{ fontSize: '0.55rem', letterSpacing: '0.15em', lineHeight: 1.8 }}
        >
          Free global shipping · 30-day returns · Limited quantities · One per customer
        </div>
      </div>
    </SectionWrapper>
  );
}
