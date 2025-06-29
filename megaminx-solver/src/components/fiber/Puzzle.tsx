'use client';

import { AddToScene } from '../dom/Scene';

export default function Puzzle() {
  return (
    <AddToScene>
      <group>
        <mesh>
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color='orange' />
        </mesh>
      </group>
    </AddToScene>
  );
}
