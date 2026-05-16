'use client';

interface Props {
  index: string;   // e.g. "01 / 07"
  title: string;
  glow: string;
}

export default function SectionLabel({ index, title, glow }: Props) {
  return (
    <div className="absolute top-8 left-10 z-20 pointer-events-none">
      <div className="font-mono-spec text-white/30 mb-2">{index}</div>
      <div
        className="h-px w-8"
        style={{ background: glow, opacity: 0.6 }}
      />
    </div>
  );
}
