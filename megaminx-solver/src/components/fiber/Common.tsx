'use client';

import { OrbitControls } from '@react-three/drei';
import { AddToScene } from '../dom/Scene';

export default function Common() {
  return (
    <AddToScene>
      <OrbitControls />
      <ambientLight intensity={1} color='white' />
    </AddToScene>
  );
}
