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
  /** Increments to trigger a Matrix-style glitch on the number. */
  glitchKey?: number;
}

const SCRAMBLE_CHARS = '0123456789';
const SCRAMBLE_DURATION = 380; // ms
const SCRAMBLE_TICK = 30;      // ms between scramble frames

export default function StatCounter({
  value,
  decimals = 0,
  suffix,
  label,
  sublabel,
  glow,
  delay = 0,
  glitchKey = 0,
}: Props) {
  const numRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const trueValueRef = useRef<string>('0');
  const scrambleTimerRef = useRef<number | null>(null);
  const glitchClassTimerRef = useRef<number | null>(null);

  // Count-up animation (intersection-observer gated)
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
          const v = obj.val.toFixed(decimals);
          el.textContent = v;
        },
        onComplete: () => {
          trueValueRef.current = value.toFixed(decimals);
          el.textContent = trueValueRef.current;
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

  // Matrix glitch — fires when glitchKey increments (after count-up settles)
  useEffect(() => {
    if (glitchKey === 0) return;
    const el = numRef.current;
    if (!el || !trueValueRef.current) return;

    // Stop any in-flight scramble before starting a new one
    if (scrambleTimerRef.current) {
      window.clearInterval(scrambleTimerRef.current);
      scrambleTimerRef.current = null;
    }
    if (glitchClassTimerRef.current) {
      window.clearTimeout(glitchClassTimerRef.current);
      glitchClassTimerRef.current = null;
    }

    // Toggle CSS class for chromatic aberration + skew
    el.classList.add('is-glitching');
    glitchClassTimerRef.current = window.setTimeout(() => {
      el.classList.remove('is-glitching');
    }, 420);

    const truth = trueValueRef.current;
    const scramble = () => {
      // Keep decimal point in place; scramble digits only.
      return truth
        .split('')
        .map((c) =>
          c === '.' ? '.' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
        )
        .join('');
    };

    let elapsed = 0;
    scrambleTimerRef.current = window.setInterval(() => {
      elapsed += SCRAMBLE_TICK;
      if (elapsed >= SCRAMBLE_DURATION) {
        if (scrambleTimerRef.current) window.clearInterval(scrambleTimerRef.current);
        scrambleTimerRef.current = null;
        el.textContent = truth;
        return;
      }
      el.textContent = scramble();
    }, SCRAMBLE_TICK);

    return () => {
      if (scrambleTimerRef.current) window.clearInterval(scrambleTimerRef.current);
      if (glitchClassTimerRef.current) window.clearTimeout(glitchClassTimerRef.current);
    };
  }, [glitchKey]);

  return (
    <div ref={wrapRef} className="stat-counter flex flex-col items-center" style={{ opacity: 0 }}>
      <div className="flex items-end gap-1" style={{ lineHeight: 0.85 }}>
        <div
          ref={numRef}
          className="font-display stat-num"
          style={{
            fontSize: 'clamp(6.5rem, 14vw, 14rem)',
            color: glow,
            letterSpacing: '-0.04em',
            display: 'inline-block', // CSS transform needs a block-level context
          }}
        >
          0
        </div>
        <div
          className="font-display text-white/50 pb-2"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}
        >
          {suffix}
        </div>
      </div>
      <div
        className="font-display text-white mt-4 text-center"
        style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.7rem)', letterSpacing: '0.08em' }}
      >
        {label}
      </div>
      <div
        className="font-mono-spec text-white/30 mt-2 text-center"
        style={{ fontSize: '0.72rem' }}
      >
        {sublabel}
      </div>
    </div>
  );
}
