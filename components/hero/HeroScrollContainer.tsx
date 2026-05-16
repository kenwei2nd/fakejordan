'use client';

import SneakerStage from './SneakerStage';
import VariationCarousel from './VariationCarousel';
import HeroCopy from './HeroCopy';
import HeroNav from './HeroNav';
import HeroFooterMeta from './HeroFooterMeta';
import MoodWord from './MoodWord';

export default function HeroScrollContainer() {
  return (
    <div
      id="hero-scroll"
      style={{
        height: '500vh',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* CSS sticky-pinned stage. Sticks to top while scrolling through 500vh. */}
      <div
        id="hero-stage"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Mood word (giant background type) */}
        <MoodWord />

        {/* Sneaker centerpiece */}
        <SneakerStage />

        {/* Top nav */}
        <HeroNav />

        {/* Side copy (left + right) */}
        <HeroCopy />

        {/* Bottom corner meta (price/size + scroll cue) */}
        <HeroFooterMeta />

        {/* Dome carousel */}
        <VariationCarousel />
      </div>
    </div>
  );
}
