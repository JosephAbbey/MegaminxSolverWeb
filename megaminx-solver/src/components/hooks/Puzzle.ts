import { Puzzle, Turn } from "@/types/Puzzle"
import { useState } from "react"

interface PuzzleHook {
  state: Puzzle
  setState: (puzzle: Puzzle) => void
  turn: (t: Turn) => void
}

export default function usePuzzle(puzzle: Puzzle): PuzzleHook {
  const [state, setState] = useState(puzzle)

  const turn = (t: Turn) => {
    setState(state.turn(t))
  }

  return { state, setState, turn }
}
