import { Puzzle } from "@/types/Puzzle"
import { useState } from "react"

export default function usePuzzle(puzzle: Puzzle): {
  puzzle: Puzzle
  setPuzzle: (puzzle: Puzzle) => void
  rotateFace: (index: number, anticlockwise: boolean) => void
} {
  const [state, setState] = useState(puzzle)

  const rotateFace = (index: number, anticlockwise: boolean) => {
    setState(state.rotateFace(index, anticlockwise))
  }

  return { puzzle: state, setPuzzle: setState, rotateFace }
}
