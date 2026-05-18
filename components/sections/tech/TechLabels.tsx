'use client';

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHeroStore } from '@/lib/store';

interface Props {
  cardRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}

type Side = 'left' | 'right';

interface LabelDef {
  name: string;
  spec: string;
  detail: string;
  side: Side;
  labelTopPct: number;
  originXPct: number;
  originYPct: number;
}

const LABELS: LabelDef[] = [
  {
    name: 'AdaptFit',
    spec: '3D-knit · zonal support',
    detail:
      'Machine-knit upper with three density zones — breathable mesh at toe, structural midfoot, lockdown collar.',
    side: 'left',
    labelTopPct: 10,
    originXPct: 55,
    originYPct: 22,
  },
  {
    name: 'AeroPlate',
    spec: 'Carbon shank · 18g',
    detail:
      'Uni-directional carbon fibre plate tuned for toe-off. Stiffness index 94 — aggressive forward roll, zero lateral flex.',
    side: 'right',
    labelTopPct: 30,
    originXPct: 50,
    originYPct: 50,
  },
  {
    name: 'VaporCell',
    spec: 'N₂ Air · 38mm',
    detail:
      'Nitrogen-injected open-cell EVA returns 38% of impact energy. 22% lighter than conventional foam.',
    side: 'left',
    labelTopPct: 56,
    originXPct: 50,
    originYPct: 70,
  },
  {
    name: 'GripLock',
    spec: 'Bi-density · 4mm lug',
    detail:
      'Softer forefoot rubber for grip, firmer heel for durability. Hexagonal lugs cut on all vectors.',
    side: 'right',
    labelTopPct: 76,
    originXPct: 50,
    originYPct: 92,
  },
];

// techProgress (0 → 1) is driven by a 1.2s tween that fires the moment the
// shoe-split video reaches its final frame. The whole range is the reveal:
//   0.00 → 0.40  leader-line draw (per-label stagger)
//   0.40 → 0.95  label slide-in   (per-label stagger)
const LINE_START = 0.0;
const LINE_DURATION = 0.4;
const LINE_STAGGER = 0.05;

const LABEL_START = 0.4;
const LABEL_DURATION = 0.5;
const LABEL_STAGGER = 0.06;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

interface Path {
  originX: number;
  originY: number;
  labelX: number;
  labelY: number;
}

export default function TechLabels({ cardRef }: Props) {
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [dims, setDims] = useState<{ width: number; height: number; paths: Path[] } | null>(null);

  useLayoutEffect(() => {
    const compute = () => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const paths: Path[] = LABELS.map((label, i) => {
        const originX = (label.originXPct / 100) * w;
        const originY = (label.originYPct / 100) * h;

        const labelEl = labelRefs.current[i];
        let labelX = label.side === 'left' ? 0.05 * w : 0.95 * w;
        let labelY = (label.labelTopPct / 100) * h + 20;
        if (labelEl) {
          const lr = labelEl.getBoundingClientRect();
          labelY = lr.top - rect.top + 14;
          labelX =
            label.side === 'left'
              ? lr.right - rect.left + 8
              : lr.left - rect.left - 8;
        }

        return { originX, originY, labelX, labelY };
      });

      setDims({ width: w, height: h, paths });
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (cardRef.current) ro.observe(cardRef.current);
    window.addEventListener('resize', compute);
    const t = window.setTimeout(compute, 60);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
      window.clearTimeout(t);
    };
  }, [cardRef]);

  useEffect(() => {
    const apply = (p: number) => {
      LABELS.forEach((label, i) => {
        const lineStart = LINE_START + i * LINE_STAGGER;
        const lineT = clamp01((p - lineStart) / LINE_DURATION);
        const lineEased = smoothstep(lineT);

        const labelStart = LABEL_START + i * LABEL_STAGGER;
        const labelT = clamp01((p - labelStart) / LABEL_DURATION);
        const labelEased = smoothstep(labelT);

        const lineEl = lineRefs.current[i];
        const dotEl = dotRefs.current[i];
        const haloEl = haloRefs.current[i];
        const labelEl = labelRefs.current[i];

        if (lineEl) {
          const len = lineEl.getTotalLength?.() ?? 800;
          lineEl.style.strokeDasharray = String(len);
          lineEl.style.strokeDashoffset = String(len * (1 - lineEased));
        }
        if (dotEl) {
          dotEl.style.opacity = String(lineEased);
        }
        if (haloEl) {
          haloEl.style.opacity = String(lineEased);
        }
        if (labelEl) {
          labelEl.style.opacity = String(labelEased);
          const slide = (1 - labelEased) * 22;
          const dx = label.side === 'left' ? -slide : slide;
          labelEl.style.transform = `translateX(${dx}px)`;
        }
      });
    };

    apply(useHeroStore.getState().techProgress);
    return useHeroStore.subscribe((state, prev) => {
      if (state.techProgress !== prev.techProgress) apply(state.techProgress);
    });
  }, []);

  return (
    <>
      {dims && (
        <svg
          width={dims.width}
          height={dims.height}
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
          }}
          aria-hidden
        >
          {dims.paths.map((p, i) => (
            <g key={LABELS[i].name}>
              <line
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                x1={p.labelX}
                y1={p.labelY}
                x2={p.originX}
                y2={p.originY}
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth={0.75}
                style={{ strokeDasharray: 800, strokeDashoffset: 800 }}
              />
              {/* Pulsing halo behind the anchor dot */}
              <circle
                ref={(el) => {
                  haloRefs.current[i] = el;
                }}
                className="tech-anchor-halo"
                cx={p.originX}
                cy={p.originY}
                r={4}
                fill="rgba(255, 45, 58, 0.65)"
                style={{ opacity: 0 }}
              />
              {/* Solid anchor dot */}
              <circle
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                cx={p.originX}
                cy={p.originY}
                r={2.5}
                fill="#ffffff"
                style={{
                  opacity: 0,
                  filter: 'drop-shadow(0 0 4px rgba(255, 45, 58, 0.9))',
                }}
              />
            </g>
          ))}
        </svg>
      )}

      {LABELS.map((label, i) => (
        <div
          key={label.name}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          style={{
            position: 'absolute',
            top: `${label.labelTopPct}%`,
            [label.side]: '4%',
            maxWidth: 'min(22%, 240px)',
            zIndex: 4,
            opacity: 0,
            pointerEvents: 'none',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: label.side === 'right' ? 'right' : 'left',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.28em',
              color: 'rgba(255, 45, 58, 0.85)',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            {String(i + 1).padStart(2, '0')} // {label.spec}
          </div>
          <div
            style={{
              fontSize: 'clamp(1.1rem, 1.8vw, 1.7rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              fontWeight: 500,
              color: '#ffffff',
              marginBottom: '12px',
              textTransform: 'uppercase',
              textShadow: '0 0 18px rgba(255, 45, 58, 0.3)',
            }}
          >
            {label.name}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              lineHeight: 1.55,
              letterSpacing: '0.02em',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            {label.detail}
          </div>
        </div>
      ))}
    </>
  );
}
