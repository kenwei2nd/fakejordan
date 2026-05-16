'use client';

import { useRef } from 'react';
import Image from 'next/image';
import SectionWrapper from '../SectionWrapper';
import TechCallout from './TechCallout';
import { sections } from '@/lib/sections';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import gsap from 'gsap';

const meta = sections.find((s) => s.id === 'tech')!;

const CALLOUTS = [
  {
    num: '01',
    name: 'AeroPlate™',
    spec: 'Full-length · 18g',
    detail: 'Uni-directional carbon fibre propulsion plate tuned for the toe-off phase. Stiffness index 94 — aggressive forward roll, zero lateral flex.',
  },
  {
    num: '02',
    name: 'VaporCell™',
    spec: 'N₂-infused · 38mm heel',
    detail: 'Nitrogen-injected open-cell EVA returns 38% of impact energy. 22% lighter than conventional foam at equivalent cushion depth.',
  },
  {
    num: '03',
    name: 'GripLock™',
    spec: 'Multi-dir. rubber · 4mm lug',
    detail: 'Bi-density outsole rubber: softer forefoot for court grip, firmer heel for durability. Hexagonal lug geometry cuts on all vectors.',
  },
  {
    num: '04',
    name: 'AdaptFit™',
    spec: '3D-knit · zonal support',
    detail: 'Machine-knit upper with three distinct density zones — breathable mesh at toe box, structural weave at midfoot, lockdown padding at ankle collar.',
  },
];

export default function TechSection() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.tech-shoe-wrap',
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }
    ).fromTo(
      '.tech-callout',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.12 },
      '-=0.4'
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
        style={{ padding: '0 5vw' }}
      >
        {/* Left: shoe */}
        <div
          className="tech-shoe-wrap shrink-0 flex items-center justify-center"
          style={{ width: '46%', opacity: 0 }}
        >
          <div style={{ position: 'relative' }}>
            {/* Glow behind shoe */}
            <div
              style={{
                position: 'absolute',
                inset: '-20%',
                borderRadius: '50%',
                background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${meta.glow}30, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
            <Image
              src="/sneakers/bfadac52acbca9bc2272e29ea00af1b5_1778827817_55jljljc.png"
              alt="AR4 — AeroPlate Carbon"
              width={900}
              height={900}
              priority
              quality={95}
              sizes="45vw"
              style={{ width: 'clamp(300px, 40vw, 600px)', height: 'auto', display: 'block', position: 'relative' }}
            />
          </div>
        </div>

        {/* Right: callouts */}
        <div
          className="flex flex-col justify-center"
          style={{ flex: 1, paddingLeft: '4vw', gap: '2.2rem' }}
        >
          {/* Section heading */}
          <div>
            <div className="font-mono-spec text-white/30 mb-2">Technology / AR4</div>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)', color: meta.glow, lineHeight: 0.9 }}
            >
              Built Different.
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: `${meta.glow}30`, width: '100%' }} />

          {/* Callout list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            {CALLOUTS.map((c) => (
              <TechCallout key={c.num} {...c} glow={meta.glow} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
