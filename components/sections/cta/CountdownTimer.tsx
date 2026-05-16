'use client';

import { useEffect, useState } from 'react';

// Drop date: 30 days from hard-coded date so demo always has a future target.
const DROP_DATE = new Date('2026-06-14T12:00:00Z');

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer({ glow }: { glow: string }) {
  const [parts, setParts] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const tick = () => {
      const diff = DROP_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setParts({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setParts({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { value: parts.d, label: 'Days' },
    { value: parts.h, label: 'Hours' },
    { value: parts.m, label: 'Min' },
    { value: parts.s, label: 'Sec' },
  ];

  return (
    <div className="flex items-end gap-3">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-end gap-3">
          <div className="flex flex-col items-center">
            <div
              className="font-display tabular-nums"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: glow, lineHeight: 1 }}
            >
              {b.value}
            </div>
            <div className="font-mono-spec text-white/30 mt-1" style={{ fontSize: '0.58rem' }}>
              {b.label.toUpperCase()}
            </div>
          </div>
          {i < 3 && (
            <div
              className="font-display text-white/20 pb-6"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}
            >
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
