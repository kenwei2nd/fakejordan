'use client';

import { ReactNode } from 'react';
import SectionLabel from './SectionLabel';

interface Props {
  id: string;
  bg: string;
  glow: string;
  label: string;
  title: string;
  children: ReactNode;
}

export default function SectionWrapper({
  id,
  bg,
  glow,
  label,
  title,
  children,
}: Props) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: bg,
        // Must sit above hero-bg (z:0) and grain (z:3)
        zIndex: 20,
        // Expose glow colour to children
        ['--section-glow' as string]: glow,
      }}
    >
      <SectionLabel index={label} title={title} glow={glow} />

      {/* Large ghosted section title — same language as hero MoodWord */}
      <div
        className="absolute font-display pointer-events-none select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(80px, 14vw, 260px)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `1px ${glow}30`,
          zIndex: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {title}
      </div>

      {/* Section content, sits above ghost text */}
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}
