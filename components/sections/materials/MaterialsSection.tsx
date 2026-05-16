'use client';

import { useRef } from 'react';
import SectionWrapper from '../SectionWrapper';
import { sections } from '@/lib/sections';
import { useSectionReveal } from '@/hooks/useSectionReveal';

const meta = sections.find((s) => s.id === 'materials')!;

const LAYERS = [
  {
    name: 'AdaptFit™ Knit Upper',
    spec: '3D-WOVEN · 62G/M²',
    desc: 'Zonal-density single-layer knit. No cement. No waste.',
    side: 'left',
    color: '#d97706',
    pattern: 'repeating-linear-gradient(45deg, #d9770610 0px, #d9770610 2px, transparent 2px, transparent 10px)',
  },
  {
    name: 'BioMesh™ Lateral Cage',
    spec: 'TPU WELDED · 0.4MM',
    desc: 'Heat-fused skeletal cage for lateral containment without excess material.',
    side: 'right',
    color: '#92400e',
    pattern: 'repeating-linear-gradient(-45deg, #92400e15 0px, #92400e15 1px, transparent 1px, transparent 8px)',
  },
  {
    name: 'VaporCell™ Midsole',
    spec: 'N₂-EVA · 38MM HEEL',
    desc: 'Nitrogen-infused open-cell foam. 38% energy return at 22% lighter weight.',
    side: 'left',
    color: '#fbbf24',
    pattern: 'radial-gradient(circle at 50% 50%, #fbbf2418 0%, transparent 60%)',
  },
  {
    name: 'AeroPlate™ + GripLock™',
    spec: 'CFRP · DUAL-DENSITY RUBBER',
    desc: 'Full-length carbon shank bonded to bi-density rubber outsole. 4mm hexagonal lugs.',
    side: 'right',
    color: '#78350f',
    pattern: 'repeating-linear-gradient(0deg, #78350f20 0px, #78350f20 3px, transparent 3px, transparent 12px)',
  },
];

export default function MaterialsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionReveal(ref as React.RefObject<HTMLElement>, (tl) => {
    tl.fromTo(
      '.mat-heading',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    ).fromTo(
      '.mat-layer',
      { y: 0, opacity: 0, scaleY: 0.4 },
      { y: 0, opacity: 1, scaleY: 1, duration: 0.55, ease: 'power3.out', stagger: 0.1 },
      '-=0.2'
    ).fromTo(
      '.mat-label',
      { opacity: 0, x: (i) => (LAYERS[i % LAYERS.length].side === 'left' ? -20 : 20) },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
      '-=0.5'
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
        style={{ padding: '8vh 8vw' }}
      >
        {/* Heading */}
        <div className="mat-heading text-center mb-10" style={{ opacity: 0 }}>
          <div className="font-mono-spec text-white/30 mb-2">Anatomy / AR4 Mid</div>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.5rem)', color: meta.glow }}
          >
            Four Layers. One Purpose.
          </h2>
        </div>

        {/* Layers stack */}
        <div
          style={{ width: '100%', maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          {LAYERS.map((layer, i) => (
            <div
              key={layer.name}
              className="mat-layer"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                opacity: 0,
              }}
            >
              {/* Left label */}
              {layer.side === 'left' && (
                <div className="mat-label shrink-0" style={{ width: '220px', textAlign: 'right', opacity: 0 }}>
                  <div className="font-display text-white" style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1.1rem)' }}>
                    {layer.name}
                  </div>
                  <div className="font-mono-spec text-white/30" style={{ fontSize: '0.58rem', marginTop: '4px' }}>
                    {layer.spec}
                  </div>
                </div>
              )}
              {layer.side === 'right' && <div style={{ width: '220px' }} />}

              {/* Bar */}
              <div
                style={{
                  flex: 1,
                  height: `${60 - i * 4}px`,
                  borderRadius: '6px',
                  background: layer.pattern,
                  backgroundColor: `${layer.color}18`,
                  border: `1px solid ${layer.color}35`,
                  boxShadow: `0 4px 20px ${layer.color}20, inset 0 1px 0 ${layer.color}25`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Sheen */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: `linear-gradient(to bottom, ${layer.color}20, transparent)`,
                  }}
                />
                {/* Layer number */}
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-mono-spec"
                  style={{ color: `${layer.color}60`, fontSize: '0.6rem' }}
                >
                  LAYER 0{i + 1}
                </div>
              </div>

              {/* Right label */}
              {layer.side === 'right' && (
                <div className="mat-label shrink-0" style={{ width: '220px', opacity: 0 }}>
                  <div className="font-display text-white" style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1.1rem)' }}>
                    {layer.name}
                  </div>
                  <div className="font-mono-spec text-white/30" style={{ fontSize: '0.58rem', marginTop: '4px' }}>
                    {layer.spec}
                  </div>
                </div>
              )}
              {layer.side === 'left' && <div style={{ width: '220px' }} />}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="font-mono-spec text-white/20 mt-10 text-center"
          style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}
        >
          All weights measured in US Men&rsquo;s 10 · Materials subject to colorway variation
        </div>
      </div>
    </SectionWrapper>
  );
}
