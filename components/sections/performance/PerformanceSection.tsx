'use client';

import { useRef, useEffect, useState } from 'react';
import SectionWrapper from '../SectionWrapper';
import StatCounter from './StatCounter';
import { sections } from '@/lib/sections';
import { useSectionReveal } from '@/hooks/useSectionReveal';

const meta = sections.find((s) => s.id === 'performance')!;

const STATS = [
  { value: 38, decimals: 0, suffix: '%', label: 'Energy Return', sublabel: 'VaporCell™ N₂-foam · ISO 20344' },
  { value: 8.2, decimals: 1, suffix: 'oz', label: 'Total Weight', sublabel: "US Men's 10 · without insole" },
  { value: 8, decimals: 0, suffix: 'mm', label: 'Heel-to-Toe Drop', sublabel: 'AeroPlate™ geometry' },
  { value: 42, decimals: 0, suffix: 'mm', label: 'Stack Height', sublabel: 'Heel · compressed load' },
];

// Random-interval glitch scheduler — picks a random stat every 3.5–9s.
// First glitch waits until count-up has finished (≥3.5s after mount).
const GLITCH_MIN_MS = 3500;
const GLITCH_MAX_MS = 9000;

export default function PerformanceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [glitches, setGlitches] = useState<Record<number, number>>({});

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.perf-heading',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    ).fromTo(
      '.stat-counter',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12 },
      '-=0.2'
    ).fromTo(
      '.perf-divider',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut', transformOrigin: 'left' },
      0
    );
  });

  // Recurring glitch: random delay → pick random card → bump its glitchKey.
  useEffect(() => {
    let timer: number;
    const schedule = () => {
      const delay = GLITCH_MIN_MS + Math.random() * (GLITCH_MAX_MS - GLITCH_MIN_MS);
      timer = window.setTimeout(() => {
        const idx = Math.floor(Math.random() * STATS.length);
        setGlitches((prev) => ({ ...prev, [idx]: (prev[idx] ?? 0) + 1 }));
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <SectionWrapper
      id={meta.id}
      bg={meta.bg}
      glow={meta.glow}
      label={meta.label}
      title={meta.title}
      hideTitle
    >
      <div
        ref={ref}
        className="flex flex-col items-center justify-center h-full"
        style={{ padding: '6vh 4vw', gap: '5vh' }}
      >
        <div className="perf-heading text-center" style={{ opacity: 0 }}>
          <div className="font-mono-spec text-white/30 mb-2">Performance / AR4 · Lab Data</div>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(2.2rem, 4.2vw, 4.2rem)', color: meta.glow }}
          >
            Numbers Don&rsquo;t Lie.
          </h2>
        </div>

        <div
          className="perf-divider h-px"
          style={{ width: '100%', maxWidth: '1200px', background: `${meta.glow}25`, transform: 'scaleX(0)' }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            width: '100%',
            maxWidth: '1400px',
            gap: '0',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                borderRight: i < 3 ? `1px solid ${meta.glow}15` : 'none',
                padding: '0 2vw',
              }}
            >
              <StatCounter
                {...s}
                glow={meta.glow}
                delay={i * 0.15}
                glitchKey={glitches[i] ?? 0}
              />
            </div>
          ))}
        </div>

        <div
          className="font-mono-spec text-white/20 text-center"
          style={{ fontSize: '0.62rem', letterSpacing: '0.2em' }}
        >
          All data independently verified · Conditions: 23°C / 50% RH · FakeJordan Performance Labs 2025
        </div>
      </div>
    </SectionWrapper>
  );
}
