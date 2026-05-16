'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

interface Segment {
  label: string;
  pct: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({ segments, size = 240, strokeWidth = 22 }: Props) {
  const containerRef = useRef<SVGSVGElement>(null);
  const R = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * R;

  // Compute start offsets for each segment.
  let cumPct = 0;
  const arcs = segments.map((seg) => {
    const start = cumPct;
    cumPct += seg.pct;
    return { ...seg, start };
  });

  const totalSustainable = segments.reduce((s, seg) => s + seg.pct, 0);

  // GSAP arc animation — triggered externally by useSectionReveal.
  useLayoutEffect(() => {
    const circles = containerRef.current?.querySelectorAll<SVGCircleElement>('.donut-arc');
    if (!circles) return;

    circles.forEach((circle, i) => {
      const fullDash = (arcs[i].pct / 100) * C;
      gsap.fromTo(
        circle,
        { strokeDasharray: `0 ${C}` },
        {
          strokeDasharray: `${fullDash} ${C}`,
          duration: 1.2,
          delay: 0.2 + i * 0.15,
          ease: 'power3.out',
          paused: false,
        }
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        ref={containerRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {arcs.map((arc) => {
          const fullDash = (arc.pct / 100) * C;
          const offset = -((arc.start / 100) * C);
          return (
            <circle
              key={arc.label}
              className="donut-arc"
              cx={size / 2}
              cy={size / 2}
              r={R}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth - 2}
              strokeLinecap="round"
              strokeDasharray={`0 ${C}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>

      {/* Centre readout */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="font-display"
          style={{ fontSize: '2.6rem', color: '#34d399', lineHeight: 1 }}
        >
          {totalSustainable}%
        </div>
        <div
          className="font-mono-spec text-white/30 mt-1 text-center"
          style={{ fontSize: '0.55rem', lineHeight: 1.4 }}
        >
          SUSTAINABLE
          <br />
          CONTENT
        </div>
      </div>
    </div>
  );
}
