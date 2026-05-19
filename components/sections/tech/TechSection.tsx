'use client';

import { useRef } from 'react';
import { sections } from '@/lib/sections';
import TechCanvas from './TechCanvas';
import TechLabels from './TechLabels';
import TechCarryForward from './TechCarryForward';

const meta = sections.find((s) => s.id === 'tech')!;

export default function TechSection() {
  const triggerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={triggerRef}
      id={meta.id}
      style={{
        position: 'relative',
        height: '100vh',
        background: '#050505',
        zIndex: 20,
        ['--section-glow' as string]: meta.glow,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ghost section title */}
        <div
          className="font-display"
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(5rem, 14vw, 12rem)',
            color: 'rgba(255, 255, 255, 0.025)',
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {meta.title}
        </div>

        {/* Showcase Card — frosted blueprint viewport */}
        <div
          ref={cardRef}
          className="tech-card"
          style={{
            position: 'relative',
            width: 'min(88vw, 1400px)',
            height: 'min(82vh, 820px)',
          }}
        >
          {/* Blueprint grid */}
          <div className="tech-grid-overlay" />

          {/* Corner coordinate labels */}
          <span className="tech-coord" style={{ top: 14, left: 18 }}>
            01 / 04 · ENGINEERED VIEW
          </span>
          <span className="tech-coord" style={{ top: 14, right: 18 }}>
            X·1600 Y·900
          </span>
          <span className="tech-coord" style={{ bottom: 14, left: 18 }}>
            SCALE 1:1
          </span>
          <span className="tech-coord" style={{ bottom: 14, right: 18 }}>
            REV 02.6
          </span>
          <span
            className="tech-coord"
            style={{
              top: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 45, 58, 0.65)',
              letterSpacing: '0.32em',
            }}
          >
            ▼ AR4 · EXPLODED SCHEMATIC
          </span>

          <TechCanvas />
          <TechLabels cardRef={cardRef} triggerRef={triggerRef} />
        </div>

        <TechCarryForward triggerRef={triggerRef} />
      </div>
    </section>
  );
}
