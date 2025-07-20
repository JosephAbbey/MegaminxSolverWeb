"use client"

import Scene, { AddToScene } from "~/components/dom/Scene"
import Common from "~/components/fiber/Common"
import {
  ANTICLOCKWISE,
  CLOCKWISE,
  Puzzle,
  PuzzleColors,
  PuzzleEdgedFace,
  reverse,
  Turn,
} from "~/types/Puzzle"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { useRef, useState } from "react"
import usePuzzle from "~/components/hooks/usePuzzle"
import {
  EdgedFace,
  RotateFace,
  StaticPuzzle,
  Turning,
  turnRef,
} from "~/components/fiber/Puzzle"
import { Group } from "three"
import { invalidate } from "@react-three/fiber"
import { Button } from "~/components/ui/button"
import { useKeyPress } from "~/components/hooks/useKeyPress"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(-1)
  const [steps, setSteps] = useState<Turn[]>([
    // {
    //   face: 0,
    //   direction: CLOCKWISE,
    // },
    // {
    //   face: 1,
    //   direction: CLOCKWISE,
    // },
    // {
    //   face: 2,
    //   direction: CLOCKWISE,
    // },
    // {
    //   face: 3,
    //   direction: ANTICLOCKWISE,
    // },
    // {
    //   face: 4,
    //   direction: CLOCKWISE,
    // },
    // {
    //   face: 5,
    //   direction: CLOCKWISE,
    // },
    // {
    //   face: 11,
    //   direction: ANTICLOCKWISE,
    // },
  ])
  const puzzle = usePuzzle(Puzzle.SolvedPuzzle())

  const [turn, setTurn] = useState<Turn | null>(null)

  const turningRef = useRef<Group>(null!)
  const [animateFace, setAnimateFace] = useState<PuzzleEdgedFace | null>(null)

  const doTurn = async (turn: Turn) => {
    const singleTurn = {
      ...turn,
      times: 1,
    }
    for (let i = 0; i < (turn.times ?? 1); i++) {
      setAnimateFace(puzzle.state.getEdgedFace(singleTurn.face))
      setTurn(singleTurn)
      invalidate()
      await turnRef(turningRef, singleTurn)
      puzzle.turn(singleTurn)
      setTurn(null)
    }
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

  const forward = () => {
    if (turn != null || currentStep >= steps.length - 1) return
    animateToStep(currentStep + 1)
  }
  const backward = () => {
    if (turn != null || currentStep <= -1) return
    animateToStep(currentStep - 1)
  }

  useKeyPress(" ", () => {
    forward()
  })
  useKeyPress("ArrowRight", () => {
    forward()
  })
  useKeyPress("ArrowLeft", () => {
    backward()
  })

  const solve = () => {
    const p = puzzle.state.copy().getTrackingPuzzle()
    p.solve()
    setSteps(p.getOptimisedTurns())
    setCurrentStep(-1)
  }

  const scramble = async () => {
    const p = Puzzle.SolvedPuzzle().scramble()
    setSteps([])
    puzzle.setState(p)
    setCurrentStep(-1)

    // const randomTurn = () => ({
    //   face: Math.floor(Math.random() * 12),
    //   direction: Math.random() < 0.5 ? ANTICLOCKWISE : CLOCKWISE,
    // })

    // for (let i = 0; i < 100; i++) {
    //   await doTurn(randomTurn())
    // }
  }

  return (
    <div className="flex h-dvh flex-col md:flex-row">
      {/* Canvas Section (Left/top) */}
      <div className="fixed h-1/2 w-full md:h-full md:w-1/2">
        <Scene />
        <div className="absolute bottom-0 left-0 m-3">
          <Button
            variant="outline"
            size="icon"
            type="button"
            role="button"
            onMouseDown={backward}
            disabled={turn !== null || currentStep <= -1}
            className={cn("cursor-not-allowed", {
              "cursor-pointer": currentStep !== -1,
            })}
          >
            <ChevronLeft aria-label="Back" />
          </Button>
        </div>
        <div className="absolute right-0 bottom-0 m-3">
          <Button
            variant="outline"
            size="icon"
            type="button"
            role="button"
            onMouseDown={forward}
            disabled={turn !== null || currentStep >= steps.length - 1}
            className={cn("cursor-not-allowed", {
              "cursor-pointer": currentStep !== steps.length - 1,
            })}
          >
            <ChevronRight aria-label="Forward" />
          </Button>
        </div>
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
      <div className="mt-auto ml-0 flex h-1/2 w-full flex-col gap-4 overflow-y-scroll p-4 md:mt-0 md:ml-auto md:h-full md:w-1/2">
        <Button
          variant="outline"
          className="cursor-pointer"
          onMouseDown={() => scramble()}
        >
          Scramble
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          onMouseDown={() => solve()}
        >
          Solve
        </Button>
        <Button
          variant="outline"
          disabled={currentStep === -1}
          onMouseDown={() => animateToStep(-1)}
          className={cn("cursor-not-allowed select-none", {
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
                "ring-amber-500": turn !== null,
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
                  : "CLOCKWISE"}{" "}
                {step.times === 2 ? "TWICE" : ""}
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
