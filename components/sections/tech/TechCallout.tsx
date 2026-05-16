'use client';

interface Props {
  num: string;
  name: string;
  spec: string;
  detail: string;
  glow: string;
}

export default function TechCallout({ num, name, spec, detail, glow }: Props) {
  return (
    <div className="tech-callout flex items-start gap-4" style={{ opacity: 0 }}>
      {/* Number */}
      <span
        className="font-mono-spec shrink-0 mt-1"
        style={{ color: glow, fontSize: '0.65rem' }}
      >
        {num}
      </span>

      <div>
        {/* Name + spec */}
        <div className="flex items-baseline gap-3 mb-1">
          <span
            className="font-display"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)', color: '#fff' }}
          >
            {name}
          </span>
          <span className="font-mono-spec text-white/30" style={{ fontSize: '0.6rem' }}>
            {spec}
          </span>
        </div>

        {/* Connector line */}
        <div
          className="h-px mb-2"
          style={{
            width: '100%',
            background: `linear-gradient(to right, ${glow}80, ${glow}10)`,
          }}
        />

        {/* Detail copy */}
        <p className="font-body text-white/45 leading-relaxed" style={{ fontSize: '0.78rem' }}>
          {detail}
        </p>
      </div>
    </div>
  );
}
