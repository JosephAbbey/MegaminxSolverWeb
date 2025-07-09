"use client"

import React, { useMemo } from "react"
import { AddToScene } from "../dom/Scene"
import { Shape, ShapeGeometry } from "three"
import { PuzzleColor, PuzzleColorToHex } from "@/types/Puzzle"

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
  color: PuzzleColor
} & React.ComponentProps<"mesh">) {
  const triangleGeometry = useMemo(
    () => new ShapeGeometry([TriangleShape()]),
    [],
  )

  return (
    <mesh geometry={triangleGeometry} {...props}>
      <meshStandardMaterial color={PuzzleColorToHex[color]} />
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
  color: PuzzleColor
} & React.ComponentProps<"mesh">) {
  const quadrilateralGeometry = useMemo(
    () => new ShapeGeometry([QuadrilateralShape()]),
    [],
  )

  return (
    <mesh geometry={quadrilateralGeometry} {...props}>
      <meshStandardMaterial color={PuzzleColorToHex[color]} />
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
  color: PuzzleColor
} & React.ComponentProps<"mesh">) {
  const pentagonGeometry = useMemo(
    () => new ShapeGeometry([PentagonShape()]),
    [],
  )

  return (
    <mesh geometry={pentagonGeometry} {...props}>
      <meshStandardMaterial color={PuzzleColorToHex[color]} />
    </mesh>
  )
}

function Face({
  color,
  ...props
}: {
  color: PuzzleColor
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
  const r = 4.6
  return (
    <AddToScene>
      <group>
        <Face
          color={PuzzleColor.WHITE}
          position={[0, 0, r]}
          rotation={[0, 0, 0]}
        />
        {(
          [
            PuzzleColor.RED,
            PuzzleColor.BLUE,
            PuzzleColor.YELLOW,
            PuzzleColor.PURPLE,
            PuzzleColor.GREEN,
          ] satisfies PuzzleColor[]
        ).map((color, i) => (
          <group key={i} rotation={[0, 0, ((i * 4 - 1) * Math.PI) / 10]}>
            <group rotation={[0, (7 / 20) * Math.PI, 0]}>
              <group rotation={[0, 0, -Math.PI / 10]}>
                <Face color={color} position={[0, 0, r]} rotation={[0, 0, 0]} />
              </group>
            </group>
          </group>
        ))}

        <group rotation={[0, Math.PI, Math.PI / 5]}>
          <Face color={PuzzleColor.GREY} position={[0, 0, r]} />
          {(
            [
              PuzzleColor.ORANGE,
              PuzzleColor.LIME,
              PuzzleColor.PINK,
              PuzzleColor.BEIGE,
              PuzzleColor.LIGHTBLUE,
            ] satisfies PuzzleColor[]
          ).map((color, i) => (
            <group key={i} rotation={[0, 0, ((i * 4 - 1) * Math.PI) / 10]}>
              <group rotation={[0, (7 / 20) * Math.PI, 0]}>
                <group rotation={[0, 0, -Math.PI / 10]}>
                  <Face
                    color={color}
                    position={[0, 0, r]}
                    rotation={[0, 0, 0]}
                  />
                </group>
              </group>
            </group>
          ))}
        </group>

        {/* {positions.map((position, i) => (
          <Face
            key={i}
            color={`hsl(${(i * 72) % 360}, 100%, 50%)`}
            position={position}
            rotation={[0, angle, i * angle + Math.PI / 2]}
          />
        ))} */}
      </group>
    </AddToScene>
  )
}
