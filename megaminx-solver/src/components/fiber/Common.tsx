"use client"

import { OrbitControls } from "@react-three/drei"

export default function Common() {
  return (
    <>
      <OrbitControls
        enableDamping={true}
        enableZoom={false}
        enablePan={false}
        minDistance={16}
      />
      {/* <Grid infiniteGrid /> */}
      <ambientLight intensity={2} color="white" />
    </>
  )
}
