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

export type PuzzleColor = keyof typeof PuzzleColor & {}

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

export class Puzzle {}

export class PuzzleFace {
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
}

export class PuzzleCornerPiece {
  constructor(public colors: [PuzzleColor, PuzzleColor, PuzzleColor]) {}
}

export class PuzzleEdgePiece {
  constructor(public colors: [PuzzleColor, PuzzleColor]) {}
}
