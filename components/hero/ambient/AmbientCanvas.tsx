'use client';

import { Canvas } from '@react-three/fiber';
import Particles from './Particles';

export default function AmbientCanvas() {
  return (
    <div
      // Behind every fixed atmospheric layer (hero-bg z=0 ... grain z=3).
      // pointer-events: none lets wheel/click pass through to the page.
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
