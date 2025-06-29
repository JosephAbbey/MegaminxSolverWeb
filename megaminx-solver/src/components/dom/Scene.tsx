'use client';

import tunnel from 'tunnel-rat';

export const r3f = tunnel();

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

export default function Scene({
  ...props
}: React.ComponentProps<typeof Canvas>) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas
      {...props}
      onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}>
      <r3f.Out />
      <Preload all />
    </Canvas>
  );
}

export function AddToScene({ children }: { children: React.ReactNode }) {
  return <r3f.In>{children}</r3f.In>;
}
