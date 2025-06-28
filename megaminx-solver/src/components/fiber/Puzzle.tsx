import { AddToScene } from '../dom/Scene';

export default function Puzzle() {
  return (
    <AddToScene>
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='orange' />
        </mesh>
      </group>
    </AddToScene>
  );
}
