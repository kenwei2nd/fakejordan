'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Props {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
  sublabel: string;
  glow: string;
  delay?: number;
}

export default function StatCounter({
  value,
  decimals = 0,
  suffix,
  label,
  sublabel,
  glow,
  delay = 0,
}: Props) {
  const numRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    const play = () => {
      if (played.current) return;
      played.current = true;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 1.6,
        delay,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = obj.val.toFixed(decimals);
        },
      });
    };

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) play(); },
      { threshold: 0.3 }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, [value, decimals, delay]);

  return (
    <div ref={wrapRef} className="stat-counter flex flex-col items-center" style={{ opacity: 0 }}>
      <div className="flex items-end gap-1" style={{ lineHeight: 0.85 }}>
        <div
          ref={numRef}
          className="font-display"
          style={{ fontSize: 'clamp(4rem, 9vw, 9rem)', color: glow, letterSpacing: '-0.04em' }}
        >
          0
        </div>
        <div
          className="font-display text-white/50 pb-2"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}
        >
          {suffix}
        </div>
      </div>
      <div
        className="font-display text-white mt-3 text-center"
        style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.2rem)', letterSpacing: '0.08em' }}
      >
        {label}
      </div>
      <div className="font-mono-spec text-white/30 mt-1 text-center" style={{ fontSize: '0.6rem' }}>
        {sublabel}
      </div>
    </div>
  );
}
