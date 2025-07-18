"use client"

const DEBUG = false

import { ComponentProps, ReactNode, RefObject, useMemo } from "react"
import { Group, Plane, Shape, ShapeGeometry, Vector3 } from "three"
import {
  PuzzleEdgedFace,
  Puzzle,
  PuzzleColor,
  PuzzleColorToHex,
  PuzzleFace,
  Turn,
  ANTICLOCKWISE,
} from "@/types/Puzzle"
import { Text } from "@react-three/drei"
import { Clip, ClippingStandardMaterial } from "@/components/fiber/Clipping"
import { Easing, Tween } from "@tweenjs/tween.js"
import { group } from "@/components/fiber/TweenGroup"

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
  index?: number
  color: PuzzleColor
} & ComponentProps<"mesh">) {
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
  index?: number
  color: PuzzleColor
} & ComponentProps<"mesh">) {
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
} & ComponentProps<"mesh">) {
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
  index?: number
  face: PuzzleFace
} & ComponentProps<"group">) {
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

const r = 4.6
const cr = r - 1.7

export function StaticPuzzle({
  puzzle,
  hiddenFace,
}: {
  puzzle: Puzzle
  hiddenFace?: number | null
}) {
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
        ((hiddenFace * 4 - 5) * Math.PI) / 10,
      )

      return new Plane(vector, cr)
    } else if (hiddenFace < 11) {
      let vector = new Vector3(0, 0, 1)
      vector = vector.applyAxisAngle(new Vector3(0, 1, 0), (7 / 20) * Math.PI)
      vector = vector.applyAxisAngle(
        new Vector3(0, 0, 1),
        ((hiddenFace * 4 + 7) * Math.PI) / 10,
      )
      return new Plane(vector, cr)
    } else {
      return new Plane(new Vector3(0, 0, 1), cr)
    }
  }, [hiddenFace])

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

export function EdgedFace({ face }: { face: PuzzleEdgedFace }) {
  return (
    <>
      <group position={[0, 0, 4.6]} rotation={[0, 0, (4 * Math.PI) / 5]}>
        <Face face={face.face} />
      </group>
      {face.edges.map((edge, i) => (
        <group key={i} rotation={[0, 0, ((i * 4 - 1) * Math.PI) / 10]}>
          <group rotation={[0, (7 / 20) * Math.PI, 0]}>
            <group rotation={[0, 0, -Math.PI / 10]}>
              <group position={[0, 0, r]}>
                <Quadrilateral
                  color={edge[0]}
                  rotation={[0, 0, (12 / 10) * Math.PI]}
                  position={[
                    1.3 * Math.cos((9 / 10) * Math.PI),
                    1.3 * Math.sin((9 / 10) * Math.PI),
                    0,
                  ]}
                />
                <Triangle
                  color={edge[1]}
                  rotation={[0, 0, (6 / 10) * Math.PI]}
                  position={[
                    1.825 * Math.cos((11 / 10) * Math.PI),
                    1.825 * Math.sin((11 / 10) * Math.PI),
                    0,
                  ]}
                />
                <Quadrilateral
                  color={edge[2]}
                  rotation={[0, 0, (16 / 10) * Math.PI]}
                  position={[
                    1.3 * Math.cos((13 / 10) * Math.PI),
                    1.3 * Math.sin((13 / 10) * Math.PI),
                    0,
                  ]}
                />
              </group>
            </group>
          </group>
        </group>
      ))}
    </>
  )
}

export function Turning({
  children,
  turningRef: ref,
}: {
  children: ReactNode
  turningRef: RefObject<Group>
}) {
  // const anticlockwise = false
  // const ref = useRef<Group>(null!)
  // useFrame(({ clock }) => {
  //   ref.current.rotation.z = anticlockwise
  //     ? -clock.elapsedTime
  //     : clock.elapsedTime
  // })
  return <group ref={ref}>{children}</group>
}

export const turnRef = (ref: RefObject<Group>, turn: Turn) =>
  new Promise<void>((resolve) => {
    console.log("turnRef", turn, ref.current, ref.current.rotation)
    ref.current.rotation.set(0, 0, 0)
    new Tween(ref.current.rotation, group)
      .to(
        {
          x: 0,
          y: 0,
          z:
            turn.direction == ANTICLOCKWISE
              ? (2 * Math.PI) / 5
              : -(2 * Math.PI) / 5,
        },
        500,
      )
      .easing(Easing.Cubic.InOut)
      .onComplete(() => resolve())
      .start()
  })

export function RotateFace({
  children,
  index,
}: {
  children: ReactNode
  index: number
}) {
  // everything has the same number of groups, to ensure that when rerendering,
  // the same objects are just reused.
  if (index == 0) {
    return (
      <group>
        <group>
          <group>
            <group>{children}</group>
          </group>
        </group>
      </group>
    )
  }
  if (index < 6) {
    return (
      <group rotation={[0, 0, ((index * 4 - 5) * Math.PI) / 10]}>
        <group rotation={[0, (7 / 20) * Math.PI, 0]}>
          <group rotation={[0, 0, -Math.PI / 10]}>
            <group rotation={[0, 0, -(4 * Math.PI) / 5]}>{children}</group>
          </group>
        </group>
      </group>
    )
  }
  if (index < 11) {
    return (
      <group rotation={[0, Math.PI, Math.PI / 5]}>
        <group rotation={[0, 0, ((-index * 4 + 11) * Math.PI) / 10]}>
          <group rotation={[0, (7 / 20) * Math.PI, 0]}>
            <group rotation={[0, 0, -(9 * Math.PI) / 10]}>{children}</group>
          </group>
        </group>
      </group>
    )
  }
  if (index == 11) {
    return (
      <group rotation={[0, Math.PI, Math.PI / 5]}>
        <group rotation={[0, 0, (2 * Math.PI) / 5]}>
          <group>
            <group>{children}</group>
          </group>
        </group>
      </group>
    )
  }

  return (
    <group>
      <group>
        <group>
          <group>{children}</group>
        </group>
      </group>
    </group>
  )
}
