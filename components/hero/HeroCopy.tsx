'use client';

import { variations } from '@/lib/variations';
import { useHeroStore } from '@/lib/store';

export default function HeroCopy() {
  const activeIndex = useHeroStore((s) => s.activeIndex);
  const current = variations[activeIndex];

  return (
    <>
      {/* Left side: index + tagline */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-40 max-w-[14rem]">
        <div className="font-mono-spec text-white/40 mb-3">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(variations.length).padStart(2, '0')}
        </div>
        <div
          className="h-px w-10 mb-5"
          style={{ background: current.glow, opacity: 0.7 }}
        />
        <h3
          className="font-display mb-3 transition-all duration-700"
          style={{ fontSize: '1.15rem', letterSpacing: '0.02em' }}
        >
          {current.name}
        </h3>
        <p className="text-xs text-white/45 leading-relaxed font-body transition-opacity duration-700">
          {current.tagline}
        </p>
      </div>

      {/* Right side: spec / chip */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-40 text-right">
        <div className="font-mono-spec text-white/40 mb-3">Drop / 026</div>
        <div
          className="h-px w-10 mb-5 ml-auto"
          style={{ background: current.glow, opacity: 0.5 }}
        />
        <div className="font-mono-spec text-white/30 leading-relaxed">
          Pigskin Suede
          <br />
          EVA Cushion
          <br />
          Carbon Plate
        </div>
      </div>
    </>
  );
}
