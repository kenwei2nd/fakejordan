export interface SectionMeta {
  id: string;
  snapIndex: number;   // global wheel-snap index (intro = 0, hero variations = 1..5, sections 6..8)
  label: string;       // mono label top-left
  bg: string;          // section background colour (opaque, covers hero-bg)
  glow: string;        // accent / --section-glow
  title: string;       // large display heading
}

export const sections: SectionMeta[] = [
  {
    id: 'tech',
    snapIndex: 6,
    label: '01 / 03',
    bg: '#0b0f14',
    glow: '#ff2d3a',
    title: 'ENGINEERED',
  },
  {
    id: 'gallery',
    snapIndex: 7,
    label: '02 / 03',
    bg: '#0a0a0a',
    glow: '#f4f4f5',
    title: 'WORN',
  },
  {
    id: 'performance',
    snapIndex: 8,
    label: '03 / 03',
    bg: '#050505',
    glow: '#84cc16',
    title: 'MEASURED',
  },
];
