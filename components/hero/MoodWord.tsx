'use client';

import { variations } from '@/lib/variations';
import { useHeroStore } from '@/lib/store';

export default function MoodWord() {
  const activeIndex = useHeroStore((s) => s.activeIndex);
  const currentVariation = variations[activeIndex];

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
      <div
        key={currentVariation.id}
        className="font-display select-none mood-word-fade"
        style={{
          fontSize: 'clamp(140px, 24vw, 420px)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          textAlign: 'center',
          color: 'transparent',
          WebkitTextStroke: `1.5px ${currentVariation.glow}55`,
          backgroundImage: `linear-gradient(180deg, ${currentVariation.glow}25 0%, transparent 80%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          mixBlendMode: 'screen',
          willChange: 'opacity',
          transform: 'translateY(-3vh)',
        }}
      >
        {currentVariation.moodWord}
      </div>
    </div>
  );
}
