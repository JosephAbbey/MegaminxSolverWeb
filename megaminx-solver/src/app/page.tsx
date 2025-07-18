"use client"

import Scene, { AddToScene } from "@/components/dom/Scene"
import Common from "@/components/fiber/Common"
import {
  ANTICLOCKWISE,
  CLOCKWISE,
  Puzzle,
  PuzzleColors,
  PuzzleEdgedFace,
  reverse,
  Turn,
} from "@/types/Puzzle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import usePuzzle from "@/components/hooks/Puzzle"
import {
  EdgedFace,
  RotateFace,
  StaticPuzzle,
  Turning,
  turnRef,
} from "@/components/fiber/Puzzle"
import { Group } from "three"
import { invalidate } from "@react-three/fiber"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(-1)
  const steps: Turn[] = [
    {
      face: 0,
      direction: CLOCKWISE,
    },
    {
      face: 1,
      direction: CLOCKWISE,
    },
    {
      face: 2,
      direction: CLOCKWISE,
    },
    {
      face: 3,
      direction: ANTICLOCKWISE,
    },
    {
      face: 4,
      direction: CLOCKWISE,
    },
    {
      face: 5,
      direction: CLOCKWISE,
    },
    {
      face: 11,
      direction: ANTICLOCKWISE,
    },
  ]
  const puzzle = usePuzzle(Puzzle.SolvedPuzzle())

  const [turn, setTurn] = useState<Turn | null>(null)

  const turningRef = useRef<Group>(null!)
  const [animateFace, setAnimateFace] = useState<PuzzleEdgedFace | null>(null)

  const doTurn = async (turn: Turn) => {
    setAnimateFace(puzzle.state.getEdgedFace(turn.face))
    setTurn(turn)
    invalidate()
    await turnRef(turningRef, turn)
    puzzle.turn(turn)
    setTurn(null)
  }

  const animateToStep = async (index: number) => {
    if (turn != null || index == currentStep) return
    if (index < currentStep) {
      for (let i = currentStep; i > index; i--) {
        setCurrentStep(i - 1)
        await doTurn(reverse(steps[i]))
      }
    } else {
      for (let i = currentStep; i < index; i++) {
        setCurrentStep(i + 1)
        await doTurn(steps[i + 1])
      }
    }
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Canvas Section (Left/top) */}
      <div className="fixed h-1/2 w-full md:h-full md:w-1/2">
        <Scene />
      </div>

      {/* 3D */}
      <AddToScene>
        <Common />
        <StaticPuzzle puzzle={puzzle.state} hiddenFace={turn?.face} />
        <group visible={turn !== null}>
          <RotateFace index={turn?.face ?? -1}>
            <Turning turningRef={turningRef}>
              {/* <Text>{typeof animateFace}</Text> */}
              {animateFace && <EdgedFace face={animateFace} />}
            </Turning>
          </RotateFace>
        </group>
      </AddToScene>

      {/* Steps Section (Right/bottom) */}
      <div className="mt-auto ml-0 flex h-1/2 w-full flex-col gap-4 overflow-y-auto p-4 md:mt-0 md:ml-auto md:h-full md:w-1/2">
        <Button
          variant="outline"
          disabled={currentStep === -1}
          onMouseDown={() => animateToStep(-1)}
          className={cn("cursor-not-allowed", {
            "cursor-pointer": currentStep !== -1,
          })}
        >
          Reset
        </Button>
        {steps.map((step, index) => (
          <Card
            onMouseDown={() => animateToStep(index)}
            key={index}
            aria-checked={currentStep === index}
            role="radio"
            className={cn(
              "cursor-not-allowed transition-all duration-300 ease-in-out select-none",
              {
                "ring-2 ring-blue-500": currentStep === index,
                "hover:bg-accent cursor-pointer hover:shadow-lg":
                  currentStep !== index && turn == null,
              },
            )}
          >
            <CardHeader>
              <CardTitle>
                {index + 1}. Turn {PuzzleColors[step.face]} face{" "}
                {step.direction == ANTICLOCKWISE
                  ? "ANTICLOCKWISE"
                  : "CLOCKWISE"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Pariatur officiis asperiores nam, necessitatibus perspiciatis
                voluptatibus, quasi voluptates porro consequuntur quia laborum
                libero beatae aliquam fugiat, sequi reprehenderit quidem
                aspernatur. Adipisci.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
