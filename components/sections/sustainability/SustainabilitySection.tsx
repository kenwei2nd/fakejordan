'use client';

import { useRef } from 'react';
import SectionWrapper from '../SectionWrapper';
import DonutChart from './DonutChart';
import { sections } from '@/lib/sections';
import { useSectionReveal } from '@/hooks/useSectionReveal';

const meta = sections.find((s) => s.id === 'sustainability')!;

const SEGMENTS = [
  { label: 'Recycled Polyester Mesh', pct: 62, color: '#34d399' },
  { label: 'Bio-based EVA Foam', pct: 24, color: '#6ee7b7' },
  { label: 'Natural Rubber', pct: 9, color: '#a7f3d0' },
  { label: 'Recycled Carbon Fibre', pct: 5, color: '#d1fae5' },
];

const BADGES = [
  { icon: '↓', value: '40%', label: 'Lower carbon footprint vs. prior model' },
  { icon: '♻', value: '100%', label: 'Recyclable packaging (FSC-certified)' },
  { icon: '✓', value: 'B Corp', label: 'Certified · Audit #BC-2025-0441' },
];

export default function SustainabilitySection() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.sus-heading',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    ).fromTo(
      '.sus-chart',
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
      '-=0.2'
    ).fromTo(
      '.sus-segment-row',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.1 },
      '-=0.4'
    ).fromTo(
      '.sus-badge',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
      '-=0.2'
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
        className="flex flex-col items-center justify-center h-full"
        style={{ padding: '6vh 8vw', gap: '4vh' }}
      >
        {/* Heading */}
        <div className="sus-heading text-center" style={{ opacity: 0 }}>
          <div className="font-mono-spec text-white/30 mb-2">Sustainability / AR4 · Material Report</div>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.5rem)', color: meta.glow }}
          >
            Built With Conscience.
          </h2>
        </div>

        {/* Main row: chart + breakdown */}
        <div className="flex items-center gap-16 flex-wrap justify-center">
          {/* Donut */}
          <div className="sus-chart" style={{ opacity: 0 }}>
            <DonutChart segments={SEGMENTS} size={260} strokeWidth={24} />
          </div>

          {/* Breakdown list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className="sus-segment-row flex items-center gap-4"
                style={{ opacity: 0 }}
              >
                {/* Colour swatch */}
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: seg.color,
                    flexShrink: 0,
                  }}
                />
                {/* Percentage */}
                <div
                  className="font-display"
                  style={{ fontSize: '1.4rem', color: seg.color, width: '4rem', textAlign: 'right' }}
                >
                  {seg.pct}%
                </div>
                {/* Label */}
                <div className="font-body text-white/60 text-sm">{seg.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Badge row */}
        <div className="flex gap-8 flex-wrap justify-center">
          {BADGES.map((b) => (
            <div
              key={b.label}
              className="sus-badge glass rounded-lg flex flex-col items-center text-center"
              style={{ padding: '1rem 1.5rem', minWidth: '160px', opacity: 0 }}
            >
              <div
                className="font-display mb-1"
                style={{ fontSize: '1.6rem', color: meta.glow }}
              >
                {b.value}
              </div>
              <div
                className="font-mono-spec text-white/40 text-center"
                style={{ fontSize: '0.58rem', lineHeight: 1.5 }}
              >
                {b.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
