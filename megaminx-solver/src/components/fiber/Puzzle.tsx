"use client"

const DEBUG = true

import React, { useMemo } from "react"
import { Plane, Shape, ShapeGeometry, Vector3 } from "three"
import {
  Puzzle,
  PuzzleColor,
  PuzzleColorToHex,
  PuzzleFace,
} from "@/types/Puzzle"
import { Line, Text } from "@react-three/drei"
import { Clip, ClippingStandardMaterial } from "@/components/fiber/Clipping"

function TriangleShape() {
  const shape = new Shape()
  shape.moveTo(-0.5, -0.75)
  shape.lineTo(0.5, -0.75)
  shape.lineTo(0, 0.75)
  shape.lineTo(-0.5, -0.75)
  return shape
}

function Triangle({
  index,
  color,
  ...props
}: {
  index: number
  color: PuzzleColor
} & React.ComponentProps<"mesh">) {
  const triangleGeometry = useMemo(
    () => new ShapeGeometry([TriangleShape()]),
    [],
  )

  return (
    <mesh geometry={triangleGeometry} {...props}>
      {DEBUG && (
        <Text position={[0, -0.3, 0.1]}>
          {index}
          <ClippingStandardMaterial color="black" />
        </Text>
      )}
      <ClippingStandardMaterial color={PuzzleColorToHex[color]} />
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
  index,
  color,
  ...props
}: {
  index: number
  color: PuzzleColor
} & React.ComponentProps<"mesh">) {
  const quadrilateralGeometry = useMemo(
    () => new ShapeGeometry([QuadrilateralShape()]),
    [],
  )

  return (
    <mesh geometry={quadrilateralGeometry} {...props}>
      {DEBUG && (
        <Text position={[0.5, -0.5, 0.1]}>
          {index}
          <ClippingStandardMaterial color="black" />
        </Text>
      )}
      <ClippingStandardMaterial color={PuzzleColorToHex[color]} />
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
      <ClippingStandardMaterial color={PuzzleColorToHex[color]} />
    </mesh>
  )
}

function Face({
  index,
  face,
  ...props
}: {
  index: number
  face: PuzzleFace
} & React.ComponentProps<"group">) {
  return (
    <group {...props}>
      {DEBUG && (
        <Text position={[0, 0, 0.1]}>
          {index}
          <ClippingStandardMaterial color="black" />
        </Text>
      )}
      <Pentagon color={face.color} />
      {face.edges.map((edge, i) => (
        <Triangle
          key={i}
          index={i}
          color={edge}
          rotation={[0, 0, ((i * 4 + 6) / 10) * Math.PI]}
          position={[
            1.825 * Math.cos(((i * 4 + 11) / 10) * Math.PI),
            1.825 * Math.sin(((i * 4 + 11) / 10) * Math.PI),
            0,
          ]}
        />
      ))}
      {face.corners.map((corner, i) => (
        <Quadrilateral
          key={i}
          index={i}
          color={corner}
          rotation={[0, 0, ((i * 4 + 12) / 10) * Math.PI]}
          position={[
            1.3 * Math.cos(((i * 4 + 9) / 10) * Math.PI),
            1.3 * Math.sin(((i * 4 + 9) / 10) * Math.PI),
            0,
          ]}
        />
      ))}
    </group>
  )
}

export default function StaticPuzzle({
  puzzle,
  hiddenFace,
}: {
  puzzle: Puzzle
  hiddenFace?: number | null
}) {
  const r = 4.6
  const cr = r - 1.7

  // generate a plane to clip the hidden face
  const clipPlane = useMemo(() => {
    if (hiddenFace === null || hiddenFace === undefined) return null
    if (hiddenFace == 0) {
      return new Plane(new Vector3(0, 0, -1), cr)
    } else if (hiddenFace < 6) {
      let vector = new Vector3(0, 0, -1)
      vector = vector.applyAxisAngle(new Vector3(0, 1, 0), (7 / 20) * Math.PI)
      vector = vector.applyAxisAngle(
        new Vector3(0, 0, 1),
        ((hiddenFace * 4 - 1) * Math.PI) / 10,
      )

      return new Plane(vector, cr)
    } else if (hiddenFace < 11) {
      let vector = new Vector3(0, 0, 1)
      vector = vector.applyAxisAngle(new Vector3(0, 1, 0), (7 / 20) * Math.PI)
      vector = vector.applyAxisAngle(
        new Vector3(0, 0, 1),
        ((-hiddenFace * 4 + 7) * Math.PI) / 10,
      )
      return new Plane(vector, cr)
    } else {
      return new Plane(new Vector3(0, 0, 1), cr)
    }
  }, [hiddenFace, cr])

  return (
    <Clip plane={clipPlane}>
      <Face
        index={0}
        face={puzzle.faces[0]}
        position={[0, 0, r]}
        rotation={[0, 0, (4 * Math.PI) / 5]}
      />
      {puzzle.faces.slice(1, 6).map((face, i) => (
        <group key={i} rotation={[0, 0, ((i * 4 - 1) * Math.PI) / 10]}>
          <group rotation={[0, (7 / 20) * Math.PI, 0]}>
            <group rotation={[0, 0, -Math.PI / 10]}>
              <Face
                index={i + 1}
                face={face}
                position={[0, 0, r]}
                rotation={[0, 0, 0]}
              />
            </group>
          </group>
        </group>
      ))}
      <group rotation={[0, Math.PI, Math.PI / 5]}>
        {puzzle.faces.slice(6, 11).map((face, i) => (
          <group key={i} rotation={[0, 0, ((-i * 4 + 7) * Math.PI) / 10]}>
            <group rotation={[0, (7 / 20) * Math.PI, 0]}>
              <group rotation={[0, 0, -Math.PI / 10]}>
                <Face
                  index={i + 6}
                  face={face}
                  position={[0, 0, r]}
                  rotation={[0, 0, 0]}
                />
              </group>
            </group>
          </group>
        ))}
        <Face
          index={11}
          face={puzzle.faces[11]}
          position={[0, 0, r]}
          rotation={[0, 0, -(2 * Math.PI) / 5]}
        />
      </group>
    </Clip>
  )
}
