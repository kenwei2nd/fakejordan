'use client';

import { useRef } from 'react';
import SectionWrapper from '../SectionWrapper';
import { sections } from '@/lib/sections';
import { useSectionReveal } from '@/hooks/useSectionReveal';

const meta = sections.find((s) => s.id === 'designer')!;

const QUOTE =
  '"Every gram of the AR4 was argued over. The plate angle, the knit density, the lug pattern — each one is a performance decision, not a style choice."';

export default function DesignerSection() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.des-eyebrow',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    ).fromTo(
      '.des-quote',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.2'
    ).fromTo(
      '.des-underline',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power3.inOut', transformOrigin: 'left' },
      '-=0.4'
    ).fromTo(
      '.des-bio',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
      '-=0.3'
    ).fromTo(
      '.des-portrait',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
      0.1
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
      <div
        ref={ref}
        className="flex h-full items-center"
        style={{ padding: '0 8vw', gap: '8vw' }}
      >
        {/* Left: Quote + bio */}
        <div style={{ flex: 1.2 }}>
          <div className="des-eyebrow font-mono-spec text-white/30 mb-6" style={{ opacity: 0 }}>
            Lead Designer / AETHER Labs
          </div>

          {/* Pull quote */}
          <blockquote
            className="des-quote font-display text-white"
            style={{
              fontSize: 'clamp(1.1rem, 2.2vw, 2rem)',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              opacity: 0,
            }}
          >
            {QUOTE}
          </blockquote>

          {/* Animated underline */}
          <div
            className="des-underline h-px my-8"
            style={{
              background: meta.glow,
              opacity: 0.5,
              width: '60%',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
            }}
          />

          {/* Bio rows */}
          {[
            { label: 'Name', value: 'Mira Chen' },
            { label: 'Title', value: 'Lead Industrial Designer' },
            { label: 'Background', value: '12 yrs · Nike SB · New Balance FuelCell' },
            { label: 'Speciality', value: 'Performance midsole architecture · upper system integration' },
          ].map((row) => (
            <div
              key={row.label}
              className="des-bio flex gap-6 mb-3"
              style={{ opacity: 0 }}
            >
              <div className="font-mono-spec text-white/30 shrink-0" style={{ fontSize: '0.65rem', width: '90px' }}>
                {row.label.toUpperCase()}
              </div>
              <div className="font-body text-white/80 text-sm">{row.value}</div>
            </div>
          ))}
        </div>

        {/* Right: Portrait placeholder */}
        <div
          className="des-portrait shrink-0"
          style={{
            width: 'clamp(220px, 24vw, 380px)',
            aspectRatio: '3/4',
            borderRadius: '4px',
            overflow: 'hidden',
            opacity: 0,
            position: 'relative',
            border: `1px solid ${meta.glow}20`,
          }}
        >
          {/* Textured dark background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 70% 60% at 45% 35%, ${meta.glow}15, transparent 65%),
                linear-gradient(160deg, #2a241e, #0e0a07)
              `,
            }}
          />

          {/* Initials mark */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                color: `${meta.glow}30`,
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              MC
            </div>
            <div
              className="font-mono-spec text-white/20 mt-4"
              style={{ fontSize: '0.55rem', letterSpacing: '0.3em' }}
            >
              PORTRAIT — COMING SOON
            </div>
          </div>

          {/* Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
