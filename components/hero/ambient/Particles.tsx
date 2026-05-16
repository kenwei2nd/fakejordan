'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useHeroStore } from '@/lib/store';
import { variations } from '@/lib/variations';

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Stable scratch colors — never reassigned, only mutated by .copy().
  const targetGlow = useMemo(() => new THREE.Color(), []);
  const targetDark = useMemo(() => new THREE.Color(), []);
  const scratch = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const count = 100;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 8;
      arr[i + 1] = (Math.random() - 0.5) * 8;
      arr[i + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0001;
      pointsRef.current.rotation.y += 0.0002;
    }

    if (materialRef.current) {
      const { activeIndex } = useHeroStore.getState();
      const v = variations[activeIndex];
      targetGlow.set(v.glow);
      targetDark.set(v.bgMid);

      // Subtle pulse between dark and glow.
      const t = 0.3 + Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      scratch.copy(targetDark).lerp(targetGlow, t);
      materialRef.current.color.lerp(scratch, 0.08);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        ref={materialRef}
        size={0.1}
        sizeAttenuation
        color={variations[0].glow}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </Points>
  );
}
