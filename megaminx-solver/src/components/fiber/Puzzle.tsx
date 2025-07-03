"use client"

import React, { useMemo } from "react"
import { AddToScene } from "../dom/Scene"
import { DoubleSide, Shape, ShapeGeometry } from "three"

function TriangleShape() {
  const shape = new Shape()
  shape.moveTo(-0.5, -0.75)
  shape.lineTo(0.5, -0.75)
  shape.lineTo(0, 0.75)
  shape.lineTo(-0.5, -0.75)
  return shape
}

function Triangle({
  color,
  ...props
}: {
  color: React.ComponentProps<"meshStandardMaterial">["color"]
} & React.ComponentProps<"mesh">) {
  const triangleGeometry = useMemo(
    () => new ShapeGeometry([TriangleShape()]),
    [],
  )

  return (
    <mesh geometry={triangleGeometry} {...props}>
      <meshStandardMaterial side={DoubleSide} color={color} />
    </mesh>
  )
}

function QuadrilateralShape() {
  const shape = new Shape()
  shape.moveTo(0, 0)
  shape.lineTo(-0.5, -1.5)
  shape.lineTo(1.0811, -1.5)
  shape.lineTo(1.5811, 0.012)
  shape.lineTo(0, 0)
  return shape
}

function Quadrilateral({
  color,
  ...props
}: {
  color: React.ComponentProps<"meshStandardMaterial">["color"]
} & React.ComponentProps<"mesh">) {
  const quadrilateralGeometry = useMemo(
    () => new ShapeGeometry([QuadrilateralShape()]),
    [],
  )

  return (
    <mesh geometry={quadrilateralGeometry} {...props}>
      <meshStandardMaterial side={DoubleSide} color={color} />
    </mesh>
  )
}

function PentagonShape() {
  const shape = new Shape()
  // regular pentagon
  const angle = (2 * Math.PI) / 5
  for (let i = 0; i < 5; i++) {
    const x = Math.cos(i * angle + Math.PI / 2)
    const y = Math.sin(i * angle + Math.PI / 2)
    if (i === 0) {
      shape.moveTo(x, y)
    } else {
      shape.lineTo(x, y)
    }
  }
  return shape
}

function Pentagon({
  color,
  ...props
}: {
  color: React.ComponentProps<"meshStandardMaterial">["color"]
} & React.ComponentProps<"mesh">) {
  const pentagonGeometry = useMemo(
    () => new ShapeGeometry([PentagonShape()]),
    [],
  )

  return (
    <mesh geometry={pentagonGeometry} {...props}>
      <meshStandardMaterial side={DoubleSide} color={color} />
    </mesh>
  )
}

function Face({
  color,
  ...props
}: {
  color: React.ComponentProps<"meshStandardMaterial">["color"]
} & React.ComponentProps<"group">) {
  return (
    <group {...props}>
      <Pentagon color={color} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Triangle
          key={i}
          color={color}
          rotation={[0, 0, ((i * 4 + 2) / 10) * Math.PI]}
          position={[
            1.825 * Math.cos(((i * 4 + 7) / 10) * Math.PI),
            1.825 * Math.sin(((i * 4 + 7) / 10) * Math.PI),
            0,
          ]}
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Quadrilateral
          key={i}
          color={color}
          rotation={[0, 0, ((i * 4 + 4) / 10) * Math.PI]}
          position={[
            1.3 * Math.cos(((i * 4 + 1) / 10) * Math.PI),
            1.3 * Math.sin(((i * 4 + 1) / 10) * Math.PI),
            0,
          ]}
        />
      ))}
    </group>
  )
}

export default function Puzzle() {
  return (
    <AddToScene>
      <group>
        <Face color="white" position={[0, 0, 4]} rotation={[0, 0, 0]} />
        <Face color="grey" position={[0, 0, -4]} rotation={[0, Math.PI, 0]} />
      </group>
    </AddToScene>
  )
}
