"use client"

import { OrbitControls } from "@react-three/drei"
import { AddToScene } from "../dom/Scene"

export default function Common() {
  return (
    <AddToScene>
      <OrbitControls />
      {/* <Grid infiniteGrid /> */}
      <ambientLight intensity={2} color="white" />
    </AddToScene>
  )
}
