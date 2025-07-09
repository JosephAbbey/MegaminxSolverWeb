"use client"

import { OrbitControls } from "@react-three/drei"
import { AddToScene } from "../dom/Scene"

export default function Common() {
  return (
    <AddToScene>
      <OrbitControls
        enableDamping={true}
        enableZoom={false}
        enablePan={false}
        minDistance={16}
      />
      {/* <Grid infiniteGrid /> */}
      <ambientLight intensity={2} color="white" />
    </AddToScene>
  )
}
