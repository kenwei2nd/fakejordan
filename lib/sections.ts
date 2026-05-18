export interface SectionMeta {
  id: string;
  snapIndex: number;   // global wheel-snap index (intro = 0, hero variations = 1..5, tech = 6..10, rest = 11..16)
  label: string;       // mono label top-left
  bg: string;          // section background colour (opaque, covers hero-bg)
  glow: string;        // accent / --section-glow
  title: string;       // large display heading
}

export const sections: SectionMeta[] = [
  {
    id: 'tech',
    snapIndex: 6, // spans 6..10 (500vh — 200vh morph spacer + 300vh sticky stage)
    label: '01 / 07',
    bg: '#0b0f14',
    glow: '#ff2d3a',
    title: 'ENGINEERED',
  },
  {
    id: 'materials',
    snapIndex: 11,
    label: '02 / 07',
    bg: '#120c06',
    glow: '#d97706',
    title: 'LAYERED',
  },
  {
    id: 'performance',
    snapIndex: 12,
    label: '03 / 07',
    bg: '#050505',
    glow: '#84cc16',
    title: 'MEASURED',
  },
  {
    id: 'gallery',
    snapIndex: 13,
    label: '04 / 07',
    bg: '#0a0a0a',
    glow: '#f4f4f5',
    title: 'WORN',
  },
  {
    id: 'designer',
    snapIndex: 14,
    label: '05 / 07',
    bg: '#18130e',
    glow: '#e7e5e4',
    title: 'CRAFTED BY',
  },
  {
    id: 'sustainability',
    snapIndex: 15,
    label: '06 / 07',
    bg: '#071410',
    glow: '#34d399',
    title: 'CONSCIOUS',
  },
  {
    id: 'cta',
    snapIndex: 16,
    label: '07 / 07',
    bg: '#000000',
    glow: '#fbbf24',
    title: 'SECURE A PAIR',
  },
];
