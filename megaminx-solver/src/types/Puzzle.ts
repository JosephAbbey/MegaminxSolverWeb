import assert from "assert"

export const PuzzleColor = {
  WHITE: "WHITE",
  RED: "RED",
  BLUE: "BLUE",
  YELLOW: "YELLOW",
  PURPLE: "PURPLE",
  GREEN: "GREEN",
  PINK: "PINK",
  LIME: "LIME",
  ORANGE: "ORANGE",
  LIGHTBLUE: "LIGHTBLUE",
  BEIGE: "BEIGE",
  GREY: "GREY",
} as const

export type PuzzleColor = (typeof PuzzleColor)[keyof typeof PuzzleColor] & {}

export const PuzzleColors = Object.values(PuzzleColor) as PuzzleColor[]

export const PuzzleColorToHex: Record<PuzzleColor, string> = {
  WHITE: "#FFFFFF",
  RED: "#FF0000",
  BLUE: "#0000FF",
  YELLOW: "#FFFF00",
  PURPLE: "#A200FF",
  GREEN: "#008000",
  PINK: "#FF57CA",
  LIME: "#00FF00",
  ORANGE: "#FFA500",
  LIGHTBLUE: "#59B2FF",
  BEIGE: "#FFDF9E",
  GREY: "#808080",
}

// Adjacency matrix for edges that are adjacent to each face in clockwise
// order, with the first edge being adjacent to the face's 0 edge.
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
          new PuzzleCornerPiece([color, edges[i][0], edges[(i + 4) % 5][2]]),
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
}

export function reverse(turn: Turn): Turn {
  return {
    face: turn.face,
    direction: turn.direction == ANTICLOCKWISE ? CLOCKWISE : ANTICLOCKWISE,
  }
}

const AnticlockwiseSymbol = Symbol("anticlockwise")
export type Anticlockwise = boolean & { [AnticlockwiseSymbol]: "anticlockwise" }

export const ANTICLOCKWISE: Anticlockwise = true as Anticlockwise
export const CLOCKWISE: Anticlockwise = false as Anticlockwise
