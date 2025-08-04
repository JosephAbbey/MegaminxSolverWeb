"use client"

import { Check } from "lucide-react"
import { useState } from "react"
import Scene, { AddToScene } from "~/components/dom/Scene"
import Common from "~/components/fiber/Common"
import { StaticPuzzle } from "~/components/fiber/Puzzle"
import usePuzzle from "~/components/hooks/usePuzzle"
import { cn } from "~/lib/utils"
import {
  Puzzle,
  PuzzleColor,
  PuzzleColors,
  PuzzleColorToHex,
} from "~/types/Puzzle"

export default function Paint() {
  const puzzle = usePuzzle(Puzzle.SolvedPuzzle())
  const [color, setColor] = useState<PuzzleColor>(PuzzleColor.WHITE)

  return (
    <div className="relative flex h-dvh">
      <Scene />

      {/* 3D */}
      <AddToScene>
        <Common />
        <StaticPuzzle
          puzzle={puzzle.state}
          onPointerDown={(face, edge, isCorner) => {
            if (edge !== null && edge !== undefined) {
              puzzle.setPieceColor(color, face, edge, isCorner)
            }
          }}
        />
      </AddToScene>

      {/* Color Picker */}
      <div className="absolute right-0 bottom-0 m-4 grid grid-cols-3 gap-2">
        {PuzzleColors.map((c) => (
          <div
            key={c}
            className={cn(
              "flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm text-black hover:opacity-80",
              {
                "border-4 border-black": color === c,
              },
            )}
            style={{ backgroundColor: PuzzleColorToHex[c] }}
            onClick={() => setColor(c)}
          >
            {color === c && <Check />}
          </div>
        ))}
      </div>
    </div>
  )
}
