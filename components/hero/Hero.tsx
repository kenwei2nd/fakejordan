'use client';

import dynamic from 'next/dynamic';
import HeroScrollContainer from './HeroScrollContainer';
import { useHeroScrollTimeline } from '@/hooks/useHeroScrollTimeline';
import { useHeroWheelSnap } from '@/hooks/useHeroWheelSnap';

const AmbientCanvas = dynamic(() => import('./ambient/AmbientCanvas'), {
  ssr: false,
});

export default function Hero() {
  useHeroScrollTimeline();
  useHeroWheelSnap();

  return (
    <>
      {/* R3F ambient (deepest layer, behind everything) */}
      <AmbientCanvas />

      {/* Fixed atmospheric layers */}
      <div className="hero-bg" />
      <div className="hero-floor" />
      <div className="hero-vignette-top" />
      <div className="hero-vignette-bottom" />
      <div className="grain-overlay" />

      {/* Scroll container with pinned stage */}
      <HeroScrollContainer />
    </>
  );
}
