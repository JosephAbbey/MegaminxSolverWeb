"use client"

import { Grid, OrbitControls } from "@react-three/drei"
import { AddToScene } from "../dom/Scene"

export default function Common() {
  return (
    <AddToScene>
      <OrbitControls />
      <Grid infiniteGrid />
      <ambientLight intensity={1} color="white" />
    </AddToScene>
  )
}
