export interface SectionMeta {
  id: string;
  snapIndex: number;   // global wheel-snap index (hero = 0..4, sections = 5..11)
  label: string;       // mono label top-left
  bg: string;          // section background colour (opaque, covers hero-bg)
  glow: string;        // accent / --section-glow
  title: string;       // large display heading
}

export const sections: SectionMeta[] = [
  {
    id: 'tech',
    snapIndex: 5,
    label: '01 / 07',
    bg: '#07111a',
    glow: '#06b6d4',
    title: 'ENGINEERED',
  },
  {
    id: 'materials',
    snapIndex: 6,
    label: '02 / 07',
    bg: '#120c06',
    glow: '#d97706',
    title: 'LAYERED',
  },
  {
    id: 'performance',
    snapIndex: 7,
    label: '03 / 07',
    bg: '#050505',
    glow: '#84cc16',
    title: 'MEASURED',
  },
  {
    id: 'gallery',
    snapIndex: 8,
    label: '04 / 07',
    bg: '#0a0a0a',
    glow: '#f4f4f5',
    title: 'WORN',
  },
  {
    id: 'designer',
    snapIndex: 9,
    label: '05 / 07',
    bg: '#18130e',
    glow: '#e7e5e4',
    title: 'CRAFTED BY',
  },
  {
    id: 'sustainability',
    snapIndex: 10,
    label: '06 / 07',
    bg: '#071410',
    glow: '#34d399',
    title: 'CONSCIOUS',
  },
  {
    id: 'cta',
    snapIndex: 11,
    label: '07 / 07',
    bg: '#000000',
    glow: '#fbbf24',
    title: 'SECURE A PAIR',
  },
];
