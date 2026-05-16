'use client';

import { variations } from '@/lib/variations';
import { useHeroStore } from '@/lib/store';

export default function HeroFooterMeta() {
  const activeIndex = useHeroStore((s) => s.activeIndex);
  const current = variations[activeIndex];

  return (
    <>
      {/* Bottom-left: scroll cue */}
      <div className="absolute bottom-10 left-10 z-40 flex items-center gap-3 pointer-events-none">
        <div className="w-8 h-px bg-white/40" />
        <span className="font-mono-spec text-white/40">Scroll</span>
      </div>

      {/* Bottom-right: price + size */}
      <div className="absolute bottom-10 right-10 z-40 flex items-end gap-6 font-mono-spec">
        <div>
          <div className="text-white/30 text-[0.6rem] mb-1">Price</div>
          <div
            className="text-white font-display"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.01em' }}
          >
            $220
          </div>
        </div>
        <div className="w-px h-10 bg-white/15" />
        <div>
          <div className="text-white/30 text-[0.6rem] mb-1">Size</div>
          <select
            className="bg-transparent text-white border border-white/20 px-3 py-1.5 cursor-pointer hover:border-white/40 transition-colors font-mono-spec text-xs"
            style={{ borderColor: `${current.glow}40` }}
          >
            <option className="bg-black">US 8</option>
            <option className="bg-black">US 9</option>
            <option className="bg-black" defaultValue="10">
              US 10
            </option>
            <option className="bg-black">US 11</option>
            <option className="bg-black">US 12</option>
          </select>
        </div>
      </div>
    </>
  );
}
