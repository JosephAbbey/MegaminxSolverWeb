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

const AdjacentEdges: [number, number][][] = [
  [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ],
  [
    [5, 4],
    [10, 2],
    [6, 3],
    [2, 1],
    [0, 0],
  ],
  [
    [1, 4],
    [6, 2],
    [7, 3],
    [3, 1],
    [0, 1],
  ],
  [
    [2, 4],
    [7, 2],
    [8, 3],
    [4, 1],
    [0, 2],
  ],
  [
    [3, 4],
    [8, 2],
    [9, 3],
    [5, 1],
    [0, 3],
  ],
  [
    [4, 4],
    [9, 2],
    [10, 3],
    [1, 1],
    [0, 4],
  ],
  [
    [7, 4],
    [2, 2],
    [1, 3],
    [10, 1],
    [11, 0],
  ],
  [
    [8, 4],
    [3, 2],
    [2, 3],
    [6, 1],
    [11, 4],
  ],
  [
    [9, 4],
    [4, 2],
    [3, 3],
    [7, 1],
    [11, 3],
  ],
  [
    [10, 4],
    [5, 2],
    [4, 3],
    [8, 1],
    [11, 2],
  ],
  [
    [11, 1],
    [6, 4],
    [1, 2],
    [5, 3],
    [9, 1],
  ],
  [
    [10, 0],
    [9, 0],
    [8, 0],
    [7, 0],
    [6, 0],
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

  rotateFace(index: number, anticlockwise = false): this {
    assert(index >= 0 && index < this.faces.length, "Face index out of bounds")
    this.faces[index].rotate(anticlockwise)

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

  getFullFace(index: number): FullPuzzleFace {
    assert(index >= 0 && index < this.faces.length, "Index out of bounds")
    const face = this.faces[index]
    const edges = AdjacentEdges[index].map(([f, e]) =>
      this.faces[f].getEdgeCorners(e),
    )

    return new FullPuzzleFace(
      face.color,
      face.edges.map(
        (color, i) => new PuzzleEdgePiece([color, edges[i][1]]),
      ) as FullPuzzleFace["edges"],
      face.corners.map(
        (color, i) =>
          new PuzzleCornerPiece([color, edges[i][0], edges[(i + 4) % 5][2]]),
      ) as FullPuzzleFace["corners"],
    )
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

  rotate(anticlockwise = false): this {
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

export class FullPuzzleFace {
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

  flatten(): PuzzleFace {
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
