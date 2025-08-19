"use client"

import { Puzzle, PuzzleColor, Turn } from "~/types/Puzzle"
import { useState } from "react"

interface PuzzleHook {
  state: Puzzle
  setState: (puzzle: Puzzle) => void
  turn: (t: Turn) => void
  setPieceColor: (
    color: PuzzleColor,
    face: number,
    edge: number,
    isCorner?: boolean,
  ) => void
}

export default function usePuzzle(puzzle: Puzzle): PuzzleHook {
  const [state, setState] = useState(puzzle)

  const turn = (t: Turn) => {
    setState(state.turn(t))
  }

  const setPieceColor = (
    color: PuzzleColor,
    face: number,
    edge: number,
    isCorner?: boolean,
  ) => {
    const newState = state.copy()
    if (isCorner) {
      newState.faces[face].corners[edge] = color
    } else {
      newState.faces[face].edges[edge] = color
    }
    setState(newState)
  }

  return { state, setState, turn, setPieceColor }
}
