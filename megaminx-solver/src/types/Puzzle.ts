import assert from "assert"
import { Brand } from "~/types/Utils"

export const PuzzleColor = {
  TRANSPARENT: -1 as Brand<-1, "PuzzleColor">,
  WHITE: 0 as Brand<0, "PuzzleColor">,
  RED: 1 as Brand<1, "PuzzleColor">,
  BLUE: 2 as Brand<2, "PuzzleColor">,
  YELLOW: 3 as Brand<3, "PuzzleColor">,
  PURPLE: 4 as Brand<4, "PuzzleColor">,
  GREEN: 5 as Brand<5, "PuzzleColor">,
  PINK: 6 as Brand<6, "PuzzleColor">,
  LIME: 7 as Brand<7, "PuzzleColor">,
  ORANGE: 8 as Brand<8, "PuzzleColor">,
  LIGHTBLUE: 9 as Brand<9, "PuzzleColor">,
  BEIGE: 10 as Brand<10, "PuzzleColor">,
  GREY: 11 as Brand<11, "PuzzleColor">,
} as const

export type PuzzleColor = (typeof PuzzleColor)[keyof typeof PuzzleColor] & {}

export type KnownPuzzleColor = Exclude<
  PuzzleColor,
  typeof PuzzleColor.TRANSPARENT
>

export const PuzzleColors = Object.values(PuzzleColor) as PuzzleColor[]

export const PuzzleColorToHex = {
  [PuzzleColor.TRANSPARENT]: "#00000000",
  [PuzzleColor.WHITE]: "#FFFFFF",
  [PuzzleColor.RED]: "#FF0000",
  [PuzzleColor.BLUE]: "#0000FF",
  [PuzzleColor.YELLOW]: "#FFFF00",
  [PuzzleColor.PURPLE]: "#A200FF",
  [PuzzleColor.GREEN]: "#008000",
  [PuzzleColor.PINK]: "#FF57CA",
  [PuzzleColor.LIME]: "#00FF00",
  [PuzzleColor.ORANGE]: "#FFA500",
  [PuzzleColor.LIGHTBLUE]: "#59B2FF",
  [PuzzleColor.BEIGE]: "#FFDF9E",
  [PuzzleColor.GREY]: "#808080",
} as const

/**
 * Adjacency matrix for edges that are adjacent to each face in clockwise
 * order, with the first edge being adjacent to the face's 0 edge.
 *
 * Used to find attached edges and corners, and neighbouring faces.
 */
const AdjacentEdges: [number, number][][] = [
  [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ],
  [
    [0, 0],
    [5, 4],
    [10, 2],
    [6, 3],
    [2, 1],
  ],
  [
    [0, 1],
    [1, 4],
    [6, 2],
    [7, 3],
    [3, 1],
  ],
  [
    [0, 2],
    [2, 4],
    [7, 2],
    [8, 3],
    [4, 1],
  ],
  [
    [0, 3],
    [3, 4],
    [8, 2],
    [9, 3],
    [5, 1],
  ],
  [
    [0, 4],
    [4, 4],
    [9, 2],
    [10, 3],
    [1, 1],
  ],
  [
    [11, 0],
    [7, 4],
    [2, 2],
    [1, 3],
    [10, 1],
  ],
  [
    [11, 4],
    [8, 4],
    [3, 2],
    [2, 3],
    [6, 1],
  ],
  [
    [11, 3],
    [9, 4],
    [4, 2],
    [3, 3],
    [7, 1],
  ],
  [
    [11, 2],
    [10, 4],
    [5, 2],
    [4, 3],
    [8, 1],
  ],
  [
    [11, 1],
    [6, 4],
    [1, 2],
    [5, 3],
    [9, 1],
  ],
  [
    [6, 0],
    [10, 0],
    [9, 0],
    [8, 0],
    [7, 0],
  ],
]

/**
 * Rotates an edge index by one position in the specified direction.
 * Also works for corners.
 * @param index - The current edge index (0-4)
 * @param direction - The direction to rotate (CLOCKWISE or ANTICLOCKWISE)
 * @returns The new edge index after rotation
 */
function rotateEdgeIndex(index: number, direction: Anticlockwise): number {
  if (direction === CLOCKWISE) {
    return (index + 4) % 5 // Equivalent to (index - 1 + 5) % 5
  } else {
    return (index + 1) % 5
  }
}

export class Puzzle {
  constructor(
    public faces: [
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
      PuzzleFace,
    ],
  ) {}

  turn(turn: Turn): this {
    if (turn.times && turn.times > 1) {
      for (let i = 0; i < turn.times; i++) {
        this.turnOne(turn)
      }
      return this
    }
    this.turnOne(turn)
    return this
  }

  private turnOne(turn: Turn): this {
    const { face: index, direction: anticlockwise } = turn
    assert(index >= 0 && index < this.faces.length, "Face index out of bounds")
    this.faces[index].turn(anticlockwise)

    const edges = AdjacentEdges[index].map(([f, e]) =>
      this.faces[f].getEdgeCorners(e),
    )
    if (anticlockwise) {
      edges.unshift(edges.pop()!)
    } else {
      edges.push(edges.shift()!)
    }
    AdjacentEdges[index].forEach(([f, e], i) =>
      this.faces[f].setEdgeCorners(e, edges[i]),
    )

    return this
  }

  getFullFace(index: number): PuzzleFullFace {
    assert(index >= 0 && index < this.faces.length, "Index out of bounds")
    const face = this.faces[index]
    const edges = AdjacentEdges[index].map(([f, e]) =>
      this.faces[f].getEdgeCorners(e),
    )

    return new PuzzleFullFace(
      face.color,
      face.edges.map(
        (color, i) => new PuzzleEdgePiece([color, edges[i][1]]),
      ) as PuzzleFullFace["edges"],
      face.corners.map(
        (color, i) =>
          new PuzzleCornerPiece([
            color,
            edges[i][0],
            edges[rotateEdgeIndex(i, CLOCKWISE)][2],
          ]),
      ) as PuzzleFullFace["corners"],
    )
  }

  getEdgedFace(index: number): PuzzleEdgedFace {
    assert(index >= 0 && index < this.faces.length, "Index out of bounds")
    const face = this.faces[index]
    const edges = AdjacentEdges[index].map(([f, e]) =>
      this.faces[f].getEdgeCorners(e),
    )
    return new PuzzleEdgedFace(face, edges as PuzzleEdgedFace["edges"])
  }

  /**
   * @protected
   * Finds the edge with the given primary and secondary colors.
   * Returns the face index and edge index of the primary and secondary if found, otherwise undefined.
   *
   * Essentially implements a linear search with early exit.
   */
  protected findEdge(
    primary: PuzzleColor,
    secondary: PuzzleColor,
  ): [[number, number], [number, number]] | undefined {
    for (const [f1, face] of AdjacentEdges.entries()) {
      for (const [e1, [f2, e2]] of face.entries()) {
        const c1 = this.faces[f1].edges[e1]
        const c2 = this.faces[f2].edges[e2]
        if (c1 === primary && c2 === secondary) {
          return [
            [f1, e1],
            [f2, e2],
          ]
        }
        if (c1 === secondary && c2 === primary) {
          return [
            [f2, e2],
            [f1, e1],
          ]
        }
      }
    }
    return undefined
  }

  /**
   * @protected
   * Find the corner with the given primary, secondary, and tertiary colors (in any orientation).
   * Returns the face index and corner index if found, otherwise undefined.
   *
   * Essentially implements a linear search with early exit.
   *
   * Could be optimised by iterating through every corner once and storing the locations in a
   * structure, to find all corners in a single pass.
   */
  protected findCorner(
    primary: PuzzleColor,
    secondary: PuzzleColor,
    tertiary: PuzzleColor,
  ): [[number, number], [number, number], [number, number]] | undefined {
    // Reduces number of modulo operations
    const pairs = [
      [4, 0],
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ] as const
    for (const [f1, face] of AdjacentEdges.entries()) {
      for (const pair of pairs) {
        const [e2, e3] = pair
        const c1 = [f1, e3] as [number, number]
        const c2 = [face[e2][0], face[e2][1]] as [number, number]
        const c3 = [
          face[e3][0],
          rotateEdgeIndex(face[e3][1], ANTICLOCKWISE),
        ] as [number, number]
        if (
          this.faces[c1[0]].corners[c1[1]] === primary &&
          this.faces[c2[0]].corners[c2[1]] === secondary &&
          this.faces[c3[0]].corners[c3[1]] === tertiary
        ) {
          return [c1, c2, c3]
        }
        if (
          this.faces[c3[0]].corners[c3[1]] === primary &&
          this.faces[c1[0]].corners[c1[1]] === secondary &&
          this.faces[c2[0]].corners[c2[1]] === tertiary
        ) {
          return [c3, c1, c2]
        }
        if (
          this.faces[c2[0]].corners[c2[1]] === primary &&
          this.faces[c3[0]].corners[c3[1]] === secondary &&
          this.faces[c1[0]].corners[c1[1]] === tertiary
        ) {
          return [c2, c3, c1]
        }
      }
    }
    return undefined
  }

  /**
   * @protected
   * Rotates face 0 so that the edge at `from` is at `to`.
   * Also works for corners.
   * @param from - The index of the edge to rotate from (0-4)
   * @param to - The index of the edge to rotate to (0-4)
   */
  protected rotateFace0ToEdge(from: number, to: number) {
    if (from < to) {
      for (let i = from; i < to; i++) {
        this.turn({
          face: 0,
          direction: ANTICLOCKWISE,
        })
      }
    } else {
      for (let i = from; i > to; i--) {
        this.turn({
          face: 0,
          direction: CLOCKWISE,
        })
      }
    }
  }

  /** WHITE EDGES */
  layer0() {
    // Loop through each edge adjacent to the white face (face 0)
    for (const [desiredPrimaryEdgeIndex, [f]] of AdjacentEdges[0].entries()) {
      const [
        [primaryFaceIndex, primaryEdgeIndex],
        [secondaryFaceIndex, secondaryEdgeIndex],
      ] = this.findEdge(PuzzleColor.WHITE, PuzzleColors[f])!
      // Helper to rotate face 0 so that from is where to is

      // Edge is in layer 0
      if (primaryFaceIndex === 0) {
        if (primaryEdgeIndex === desiredPrimaryEdgeIndex) {
          // Edge is already in place
          continue
        }
        // Rotate edge off of face 0
        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE, // direction does not really matter
        })
        // Rotate face 0 so that the desiredPrimaryEdgeIndex is where primaryEdgeIndex is
        this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, primaryEdgeIndex)
        // Edge back onto face 0
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })
        // Reverse face 0
        this.rotateFace0ToEdge(primaryEdgeIndex, desiredPrimaryEdgeIndex)
        continue
      }
      if (secondaryFaceIndex === 0) {
        // Edge is inverted, rotate it off
        this.turn({
          face: primaryFaceIndex,
          direction: CLOCKWISE, // direction does not really matter
        })
        const e = rotateEdgeIndex(secondaryEdgeIndex, ANTICLOCKWISE)
        // Rotate face 0 so that the desiredPrimaryEdgeIndex is where e is
        this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
        // Edge back onto face 0
        this.turn({
          face: AdjacentEdges[0][e][0],
          direction: CLOCKWISE,
        })
        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
        continue
      }
      // Edge is in layer 2
      if (
        1 <= primaryFaceIndex &&
        primaryFaceIndex <= 5 &&
        1 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 5
      ) {
        const e = AdjacentEdges[secondaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to secondaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
        // Rotate edge onto face 0
        if (secondaryEdgeIndex === 1) {
          this.turn({
            face: secondaryFaceIndex,
            direction: CLOCKWISE,
          })
        } else {
          this.turn({
            face: secondaryFaceIndex,
            direction: ANTICLOCKWISE,
          })
        }
        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
        continue
      }
      // Edge is in layer 4
      if (
        1 <= primaryFaceIndex &&
        primaryFaceIndex <= 5 &&
        6 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 10
      ) {
        if (primaryEdgeIndex === 2) {
          const e = AdjacentEdges[primaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to primaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)

          // Rotate edge onto layer 2
          this.turn({
            face: primaryFaceIndex,
            direction: CLOCKWISE,
          })

          // Reverse face 0
          this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)

          const newPrimaryEdgeIndex = rotateEdgeIndex(
            primaryEdgeIndex,
            CLOCKWISE,
          )
          const newSecondaryFaceIndex =
            AdjacentEdges[primaryFaceIndex][newPrimaryEdgeIndex][0]

          const e1 = AdjacentEdges[newSecondaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e1 is (adjacent to newSecondaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e1)

          // Rotate edge onto face 0
          this.turn({
            face: newSecondaryFaceIndex,
            direction: ANTICLOCKWISE,
          })

          // Reverse face 0
          this.rotateFace0ToEdge(e1, desiredPrimaryEdgeIndex)

          continue
        }
        if (primaryEdgeIndex === 3) {
          const e = AdjacentEdges[primaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to primaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)

          // Rotate edge onto layer 2
          this.turn({
            face: primaryFaceIndex,
            direction: ANTICLOCKWISE,
          })

          // Reverse face 0
          this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)

          const newPrimaryEdgeIndex = rotateEdgeIndex(
            primaryEdgeIndex,
            ANTICLOCKWISE,
          )
          const newSecondaryFaceIndex =
            AdjacentEdges[primaryFaceIndex][newPrimaryEdgeIndex][0]

          const e1 = AdjacentEdges[newSecondaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e1 is (adjacent to newSecondaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e1)

          // Rotate edge onto face 0
          this.turn({
            face: newSecondaryFaceIndex,
            direction: CLOCKWISE,
          })

          // Reverse face 0
          this.rotateFace0ToEdge(e1, desiredPrimaryEdgeIndex)

          continue
        }
      }
      if (
        6 <= primaryFaceIndex &&
        primaryFaceIndex <= 10 &&
        1 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 5
      ) {
        if (secondaryEdgeIndex === 2) {
          const e = AdjacentEdges[secondaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to secondaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
          // Rotate edge onto face 0
          this.turn({
            face: secondaryFaceIndex,
            direction: CLOCKWISE,
            times: 2,
          })
          // Reverse face 0
          this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
          continue
        }
        if (secondaryEdgeIndex === 3) {
          const e = AdjacentEdges[secondaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to secondaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
          // Rotate edge onto layer 2
          this.turn({
            face: secondaryFaceIndex,
            direction: ANTICLOCKWISE,
            times: 2,
          })
          // Reverse face 0
          this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
          continue
        }
      }
      // Edge is in layer 6
      if (
        6 <= primaryFaceIndex &&
        primaryFaceIndex <= 10 &&
        6 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 10
      ) {
        if (primaryEdgeIndex === 1) {
          this.turn({
            face: primaryFaceIndex,
            direction: ANTICLOCKWISE,
          })
          const newPrimaryEdgeIndex = rotateEdgeIndex(
            primaryEdgeIndex,
            ANTICLOCKWISE,
          )
          const newSecondaryFaceIndex =
            AdjacentEdges[primaryFaceIndex][newPrimaryEdgeIndex][0]
          const e = AdjacentEdges[newSecondaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to newSecondaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
          // Rotate edge onto face 0
          this.turn({
            face: newSecondaryFaceIndex,
            direction: CLOCKWISE,
            times: 2,
          })
          // Reverse face 0
          this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
          continue
        }
        if (primaryEdgeIndex === 4) {
          this.turn({
            face: primaryFaceIndex,
            direction: CLOCKWISE,
          })
          const newPrimaryEdgeIndex = rotateEdgeIndex(
            primaryEdgeIndex,
            CLOCKWISE,
          )
          const newSecondaryFaceIndex =
            AdjacentEdges[primaryFaceIndex][newPrimaryEdgeIndex][0]
          const e = AdjacentEdges[newSecondaryFaceIndex][0][1]
          // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to newSecondaryFaceIndex)
          this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
          // Rotate edge onto face 0
          this.turn({
            face: newSecondaryFaceIndex,
            direction: ANTICLOCKWISE,
            times: 2,
          })
          // Reverse face 0
          this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
          continue
        }
      }
      // Edge is in layer 8
      if (primaryFaceIndex === 11) {
        // Turn the edge onto layer 6
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })
        const newSecondaryEdgeIndex = rotateEdgeIndex(
          secondaryEdgeIndex,
          ANTICLOCKWISE,
        )
        const newPrimaryFaceIndex =
          AdjacentEdges[secondaryFaceIndex][newSecondaryEdgeIndex][0]
        const newPrimaryEdgeIndex =
          AdjacentEdges[secondaryFaceIndex][newSecondaryEdgeIndex][1]

        // Turn edge onto layer 4
        this.turn({
          face: newPrimaryFaceIndex,
          direction: CLOCKWISE,
        })
        const newNewPrimaryEdgeIndex = rotateEdgeIndex(
          newPrimaryEdgeIndex,
          CLOCKWISE,
        )
        const newNewSecondaryFaceIndex =
          AdjacentEdges[newPrimaryFaceIndex][newNewPrimaryEdgeIndex][0]

        const e = AdjacentEdges[newNewSecondaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to newNewSecondaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)

        // Rotate edge onto face 0
        this.turn({
          face: newNewSecondaryFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
        continue
      }
      if (secondaryFaceIndex === 11) {
        // Turn the edge onto layer 4
        this.turn({
          face: primaryFaceIndex,
          direction: CLOCKWISE,
          times: 2,
        })
        const newPrimaryEdgeIndex = rotateEdgeIndex(
          rotateEdgeIndex(primaryEdgeIndex, CLOCKWISE),
          CLOCKWISE,
        )
        const newSecondaryFaceIndex =
          AdjacentEdges[primaryFaceIndex][newPrimaryEdgeIndex][0]

        const e = AdjacentEdges[newSecondaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryEdgeIndex is where e is (adjacent to newSecondaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryEdgeIndex, e)
        // Rotate edge onto face 0
        this.turn({
          face: newSecondaryFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })
        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryEdgeIndex)
        continue
      }
    }
  }

  /** WHITE CORNERS */
  layer1() {
    for (const [
      desiredPrimaryCornerIndex,
      [desiredTertiaryFaceIndex],
    ] of AdjacentEdges[0].entries()) {
      const [desiredSecondaryFaceIndex /* desiredSecondaryEdgeIndex */] =
        AdjacentEdges[0][rotateEdgeIndex(desiredPrimaryCornerIndex, CLOCKWISE)]
      const desiredSecondaryCornerIndex = /* rotateEdgeIndex(
        desiredSecondaryEdgeIndex,
        CLOCKWISE,
      ) */ 0
      const desiredTertiaryCornerIndex = 1
      console.log(
        PuzzleColor.WHITE,
        PuzzleColors[desiredSecondaryFaceIndex],
        PuzzleColors[desiredTertiaryFaceIndex],
      )
      console.log(
        `Desired: P ${0}, ${desiredPrimaryCornerIndex}, S ${desiredSecondaryFaceIndex}, ${desiredSecondaryCornerIndex}, T ${desiredTertiaryFaceIndex}, ${desiredTertiaryCornerIndex}`,
      )
      const [
        [primaryFaceIndex, primaryCornerIndex],
        [secondaryFaceIndex, secondaryCornerIndex],
        [tertiaryFaceIndex, tertiaryCornerIndex],
      ] = this.findCorner(
        PuzzleColor.WHITE,
        PuzzleColors[desiredSecondaryFaceIndex],
        PuzzleColors[desiredTertiaryFaceIndex],
      )!

      console.log(
        `Found: P ${primaryFaceIndex}, ${primaryCornerIndex}, S ${secondaryFaceIndex}, ${secondaryCornerIndex}, T ${tertiaryFaceIndex}, ${tertiaryCornerIndex}`,
      )

      // Corner is in layer 1
      if (primaryFaceIndex === 0) {
        if (secondaryFaceIndex === desiredSecondaryFaceIndex) {
          // Corner is already in the correct position
          continue
        }

        // Rotate corner off of face 0
        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Where we will store the corner temporarily
        const storageFaceIndex = AdjacentEdges[secondaryFaceIndex][3][0]
        this.turn({
          face: storageFaceIndex,
          direction: CLOCKWISE,
        })

        // Reverse secondary face
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Rotate face 0 so that the desiredPrimaryCornerIndex is where primaryCornerIndex is
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, primaryCornerIndex)

        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        this.turn({
          face: storageFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Corner back onto face 0
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(primaryCornerIndex, desiredPrimaryCornerIndex)

        continue
      }
      if (secondaryFaceIndex === 0) {
        // Corner is inverted, rotate it off
        this.turn({
          face: tertiaryFaceIndex,
          direction: CLOCKWISE,
        })

        const storageFaceIndex = AdjacentEdges[tertiaryFaceIndex][3][0]
        this.turn({
          face: storageFaceIndex,
          direction: CLOCKWISE,
        })

        // Reverse tertiary face
        this.turn({
          face: tertiaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        this.turn({
          face: storageFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })

        const e = rotateEdgeIndex(secondaryCornerIndex, CLOCKWISE)
        // Rotate face 0 so that the desiredPrimaryCornerIndex is where e is
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        const e2 = rotateEdgeIndex(e, CLOCKWISE)
        this.turn({
          face: AdjacentEdges[0][e2][0],
          direction: CLOCKWISE,
        })

        const newStorageFaceIndex = AdjacentEdges[storageFaceIndex][4][0]
        this.turn({
          face: newStorageFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Corner back onto face 0
        this.turn({
          face: AdjacentEdges[0][e2][0],
          direction: ANTICLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (tertiaryFaceIndex === 0) {
        // Corner is inverted, rotate it off
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        const storageFaceIndex = AdjacentEdges[secondaryFaceIndex][2][0]
        this.turn({
          face: storageFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Reverse secondary face
        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        this.turn({
          face: storageFaceIndex,
          direction: CLOCKWISE,
          times: 2,
        })

        const e = rotateEdgeIndex(tertiaryCornerIndex, ANTICLOCKWISE)
        // Rotate face 0 so that the desiredPrimaryCornerIndex is where e is
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: AdjacentEdges[0][e][0],
          direction: ANTICLOCKWISE,
        })

        const newStorageFaceIndex = AdjacentEdges[storageFaceIndex][1][0]
        this.turn({
          face: newStorageFaceIndex,
          direction: CLOCKWISE,
        })

        // Corner back onto face 0
        this.turn({
          face: AdjacentEdges[0][e][0],
          direction: CLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      // Corner is in layer 3
      if (
        1 <= primaryFaceIndex &&
        primaryFaceIndex <= 5 &&
        6 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 10 &&
        1 <= tertiaryFaceIndex &&
        tertiaryFaceIndex <= 5
      ) {
        const e = AdjacentEdges[tertiaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to tertiaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        // Store the corner temporarily
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Align edge, to insert corner
        this.turn({
          face: tertiaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Insert corner
        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Edge back onto face 0
        this.turn({
          face: tertiaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (
        1 <= primaryFaceIndex &&
        primaryFaceIndex <= 5 &&
        1 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 5 &&
        6 <= tertiaryFaceIndex &&
        tertiaryFaceIndex <= 10
      ) {
        const e = rotateEdgeIndex(
          AdjacentEdges[secondaryFaceIndex][0][1],
          ANTICLOCKWISE,
        )
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to secondaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        // Store the corner temporarily
        this.turn({
          face: tertiaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Align edge, to insert corner
        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Insert corner
        this.turn({
          face: tertiaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Edge back onto face 0
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (
        6 <= primaryFaceIndex &&
        primaryFaceIndex <= 10 &&
        1 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 5 &&
        1 <= tertiaryFaceIndex &&
        tertiaryFaceIndex <= 5
      ) {
        const e = AdjacentEdges[secondaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to secondaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: primaryFaceIndex,
          direction: CLOCKWISE,
        })

        this.turn({
          face: AdjacentEdges[primaryFaceIndex][1][0],
          direction: ANTICLOCKWISE,
        })

        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })

        this.turn({
          face: AdjacentEdges[primaryFaceIndex][1][0],
          direction: CLOCKWISE,
        })

        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
          times: 2,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      // Corner is in layer 5
      if (
        1 <= primaryFaceIndex &&
        primaryFaceIndex <= 5 &&
        6 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 10 &&
        6 <= tertiaryFaceIndex &&
        tertiaryFaceIndex <= 10
      ) {
        const e = AdjacentEdges[primaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to primaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        // Store the corner temporarily
        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Align edge, to insert corner
        this.turn({
          face: primaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Insert corner
        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })

        // Edge back onto face 0
        this.turn({
          face: primaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (
        6 <= primaryFaceIndex &&
        primaryFaceIndex <= 10 &&
        1 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 5 &&
        6 <= tertiaryFaceIndex &&
        tertiaryFaceIndex <= 10
      ) {
        const e = AdjacentEdges[secondaryFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to secondaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: AdjacentEdges[secondaryFaceIndex][1][0],
          direction: CLOCKWISE,
        })

        this.turn({
          face: tertiaryFaceIndex,
          direction: ANTICLOCKWISE,
        })

        this.turn({
          face: AdjacentEdges[secondaryFaceIndex][1][0],
          direction: ANTICLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (
        6 <= primaryFaceIndex &&
        primaryFaceIndex <= 10 &&
        6 <= secondaryFaceIndex &&
        secondaryFaceIndex <= 10 &&
        1 <= tertiaryFaceIndex &&
        tertiaryFaceIndex <= 5
      ) {
        const e = rotateEdgeIndex(
          AdjacentEdges[tertiaryFaceIndex][0][1],
          ANTICLOCKWISE,
        )
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to tertiaryFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: AdjacentEdges[tertiaryFaceIndex][4][0],
          direction: ANTICLOCKWISE,
        })

        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        this.turn({
          face: AdjacentEdges[tertiaryFaceIndex][4][0],
          direction: CLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      // Corner is in layer 7
      if (primaryFaceIndex === 11) {
        const intermediateFaceIndex = AdjacentEdges[secondaryFaceIndex][3][0]

        const e = AdjacentEdges[intermediateFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to intermediateFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: intermediateFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })

        this.turn({
          face: secondaryFaceIndex,
          direction: CLOCKWISE,
        })

        // Reverse intermediate face
        this.turn({
          face: intermediateFaceIndex,
          direction: CLOCKWISE,
          times: 2,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (secondaryFaceIndex === 11) {
        const intermediateFaceIndex = AdjacentEdges[tertiaryFaceIndex][3][0]

        const e = rotateEdgeIndex(
          AdjacentEdges[intermediateFaceIndex][0][1],
          ANTICLOCKWISE,
        )
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to intermediateFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: intermediateFaceIndex,
          direction: CLOCKWISE,
        })

        this.turn({
          face: tertiaryFaceIndex,
          direction: CLOCKWISE,
          times: 2,
        })

        this.turn({
          face: intermediateFaceIndex,
          direction: ANTICLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
      if (tertiaryFaceIndex === 11) {
        const intermediateFaceIndex = AdjacentEdges[secondaryFaceIndex][2][0]

        const e = AdjacentEdges[intermediateFaceIndex][0][1]
        // Rotate face 0 so that desiredPrimaryCornerIndex is where e is (adjacent to intermediateFaceIndex)
        this.rotateFace0ToEdge(desiredPrimaryCornerIndex, e)

        this.turn({
          face: intermediateFaceIndex,
          direction: ANTICLOCKWISE,
        })

        this.turn({
          face: secondaryFaceIndex,
          direction: ANTICLOCKWISE,
          times: 2,
        })

        this.turn({
          face: intermediateFaceIndex,
          direction: CLOCKWISE,
        })

        // Reverse face 0
        this.rotateFace0ToEdge(e, desiredPrimaryCornerIndex)

        continue
      }
    }
  }

  /** EDGES */
  layer2() {}

  /** CORNERS */
  layer3() {}

  /** EDGES */
  layer4() {}

  /** CORNERS */
  layer5() {}

  /** EDGES */
  layer6() {}

  /** GREY EDGES */
  layer8() {}

  /** GREY CORNERS */
  layer7() {}

  solve() {
    this.layer0()
    this.layer1()
    this.layer2()
    this.layer3()
    this.layer4()
    this.layer5()
    this.layer6()
    this.layer8()
    this.layer7()
  }

  getTrackingPuzzle(): TrackingPuzzle {
    return new TrackingPuzzle(this)
  }

  static UnknownPuzzle(): Puzzle {
    return new Puzzle([
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.TRANSPARENT,
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
        [
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
          PuzzleColor.TRANSPARENT,
        ],
      ),
    ])
  }

  static SolvedPuzzle(): Puzzle {
    return new Puzzle([
      new PuzzleFace(
        PuzzleColor.WHITE,
        [
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
        ],
        [
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
          PuzzleColor.WHITE,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.RED,
        [
          PuzzleColor.RED,
          PuzzleColor.RED,
          PuzzleColor.RED,
          PuzzleColor.RED,
          PuzzleColor.RED,
        ],
        [
          PuzzleColor.RED,
          PuzzleColor.RED,
          PuzzleColor.RED,
          PuzzleColor.RED,
          PuzzleColor.RED,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.BLUE,
        [
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
        ],
        [
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
          PuzzleColor.BLUE,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.YELLOW,
        [
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
        ],
        [
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
          PuzzleColor.YELLOW,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.PURPLE,
        [
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
        ],
        [
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
          PuzzleColor.PURPLE,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.GREEN,
        [
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
        ],
        [
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
          PuzzleColor.GREEN,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.PINK,
        [
          PuzzleColor.PINK,
          PuzzleColor.PINK,
          PuzzleColor.PINK,
          PuzzleColor.PINK,
          PuzzleColor.PINK,
        ],
        [
          PuzzleColor.PINK,
          PuzzleColor.PINK,
          PuzzleColor.PINK,
          PuzzleColor.PINK,
          PuzzleColor.PINK,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.LIME,
        [
          PuzzleColor.LIME,
          PuzzleColor.LIME,
          PuzzleColor.LIME,
          PuzzleColor.LIME,
          PuzzleColor.LIME,
        ],
        [
          PuzzleColor.LIME,
          PuzzleColor.LIME,
          PuzzleColor.LIME,
          PuzzleColor.LIME,
          PuzzleColor.LIME,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.ORANGE,
        [
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
        ],
        [
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
          PuzzleColor.ORANGE,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.LIGHTBLUE,
        [
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
        ],
        [
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
          PuzzleColor.LIGHTBLUE,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.BEIGE,
        [
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
        ],
        [
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
          PuzzleColor.BEIGE,
        ],
      ),
      new PuzzleFace(
        PuzzleColor.GREY,
        [
          PuzzleColor.GREY,
          PuzzleColor.GREY,
          PuzzleColor.GREY,
          PuzzleColor.GREY,
          PuzzleColor.GREY,
        ],
        [
          PuzzleColor.GREY,
          PuzzleColor.GREY,
          PuzzleColor.GREY,
          PuzzleColor.GREY,
          PuzzleColor.GREY,
        ],
      ),
    ])
  }

  isSolved(): boolean {
    return this.faces.every(
      (face) =>
        face.edges.every((color) => color === face.color) &&
        face.corners.every((color) => color === face.color),
    )
  }

  scramble(): this {
    const randomTurn = () => ({
      face: Math.floor(Math.random() * 12),
      direction: Math.random() < 0.5 ? ANTICLOCKWISE : CLOCKWISE,
    })

    for (let i = 0; i < 100; i++) {
      this.turn(randomTurn())
    }
    return this
  }

  copy(): Puzzle {
    return new Puzzle(
      this.faces.map(
        (face) =>
          new PuzzleFace(face.color, [...face.edges], [...face.corners]),
      ) as ConstructorParameters<typeof Puzzle>[0],
    )
  }
}

export class PuzzleFace {
  constructor(
    public color: PuzzleColor,
    public edges: [
      PuzzleColor,
      PuzzleColor,
      PuzzleColor,
      PuzzleColor,
      PuzzleColor,
    ],
    public corners: [
      PuzzleColor,
      PuzzleColor,
      PuzzleColor,
      PuzzleColor,
      PuzzleColor,
    ],
  ) {}

  getEdgeCorners(index: number): [PuzzleColor, PuzzleColor, PuzzleColor] {
    assert(index >= 0 && index < this.edges.length, "Index out of bounds")
    return [
      this.corners[index],
      this.edges[index],
      this.corners[(index + 1) % this.corners.length],
    ]
  }

  setEdgeCorners(
    index: number,
    colors: [PuzzleColor, PuzzleColor, PuzzleColor],
  ): this {
    assert(index >= 0 && index < this.edges.length, "Index out of bounds")
    this.corners[index] = colors[0]
    this.edges[index] = colors[1]
    this.corners[(index + 1) % this.corners.length] = colors[2]
    return this
  }

  turn(anticlockwise = false): this {
    if (anticlockwise) {
      this.edges.unshift(this.edges.pop()!)
      this.corners.unshift(this.corners.pop()!)
    } else {
      this.edges.push(this.edges.shift()!)
      this.corners.push(this.corners.shift()!)
    }

    return this
  }
}

export class PuzzleEdgedFace {
  constructor(
    public face: PuzzleFace,
    public edges: [PuzzleEdge, PuzzleEdge, PuzzleEdge, PuzzleEdge, PuzzleEdge],
  ) {}
}

export class PuzzleFullFace {
  constructor(
    public color: PuzzleColor,

    public edges: [
      PuzzleEdgePiece,
      PuzzleEdgePiece,
      PuzzleEdgePiece,
      PuzzleEdgePiece,
      PuzzleEdgePiece,
    ],
    public corners: [
      PuzzleCornerPiece,
      PuzzleCornerPiece,
      PuzzleCornerPiece,
      PuzzleCornerPiece,
      PuzzleCornerPiece,
    ],
  ) {}

  get face(): PuzzleFace {
    return new PuzzleFace(
      this.color,
      this.edges.map((edge) => edge.colors[0]) as [
        PuzzleColor,
        PuzzleColor,
        PuzzleColor,
        PuzzleColor,
        PuzzleColor,
      ],
      this.corners.map((corner) => corner.colors[0]) as [
        PuzzleColor,
        PuzzleColor,
        PuzzleColor,
        PuzzleColor,
        PuzzleColor,
      ],
    )
  }
}

export class PuzzleCornerPiece {
  constructor(public colors: [PuzzleColor, PuzzleColor, PuzzleColor]) {}
}

export class PuzzleEdgePiece {
  constructor(public colors: [PuzzleColor, PuzzleColor]) {}
}

export type PuzzleEdge = [PuzzleColor, PuzzleColor, PuzzleColor]

export type Turn = {
  face: number
  direction: Anticlockwise
  /** @default 1 */
  times?: number
}

export function reverse(turn: Turn): Turn {
  return {
    ...turn,
    direction: turn.direction == ANTICLOCKWISE ? CLOCKWISE : ANTICLOCKWISE,
  }
}

export type Anticlockwise = Brand<boolean, "Anticlockwise">

export const ANTICLOCKWISE: Anticlockwise = true as Anticlockwise
export const CLOCKWISE: Anticlockwise = false as Anticlockwise

export class TrackingPuzzle extends Puzzle {
  turns: Turn[] = []

  constructor(puzzle: Puzzle) {
    super(puzzle.faces)
  }

  turn(turn: Turn): this {
    super.turn(turn)
    this.turns.push(turn)
    return this
  }

  getOptimisedTurns(): Turn[] {
    return optimiseTurns(this.turns)
  }
}

// export function collapseTurns(turns: Turn[]): Turn[] {
//   const collapsed: Turn[] = []
//   let currentTurn: Turn | null = null
//   for (const turn of turns) {
//     if (
//       currentTurn &&
//       currentTurn.face === turn.face &&
//       currentTurn.direction === turn.direction
//     ) {
//       currentTurn.times = (currentTurn.times ?? 1) + (turn.times ?? 1)
//     } else {
//       if (currentTurn) {
//         collapsed.push(currentTurn)
//       }
//       currentTurn = { ...turn }
//     }
//   }
//   if (currentTurn) {
//     collapsed.push(currentTurn)
//   }
//   return collapsed
// }

export function optimiseTurns(turns: Turn[]): Turn[] {
  // Could go further, e.g. white clockwise, lime anticlockwise, white anticlockwise == lime anticlockwise
  const optimised: Turn[] = []
  let currentTurn: Turn | null = null
  for (const turn of turns) {
    if (currentTurn) {
      if (currentTurn.face === turn.face) {
        if (currentTurn.direction !== turn.direction) {
          currentTurn.times = (currentTurn.times ?? 1) - (turn.times ?? 1)
        } else {
          currentTurn.times = (currentTurn.times ?? 1) + (turn.times ?? 1)
        }
      } else {
        optimised.push(currentTurn)
        currentTurn = { ...turn }
      }
    } else {
      currentTurn = { ...turn }
    }
  }
  if (currentTurn) {
    if ((currentTurn.times ?? 1) > 0) {
      optimised.push(currentTurn)
    }
  }
  const reoptimised: Turn[] = []
  for (const turn of optimised) {
    let times = turn.times ?? 1
    let direction = turn.direction
    if (times < 0) {
      times = -times
      direction = !direction as Anticlockwise
    }
    times = times % 5
    if (times > 2) {
      times = 5 - times
      direction = !direction as Anticlockwise
    }
    if (times !== 0) {
      reoptimised.push({ ...turn, times, direction })
    }
  }
  return reoptimised
}
