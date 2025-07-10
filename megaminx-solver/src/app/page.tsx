"use client"

import Scene, { AddToScene } from "@/components/dom/Scene"
import Common from "@/components/fiber/Common"
import StaticPuzzle from "@/components/fiber/Puzzle"
import { Puzzle } from "@/types/Puzzle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"
import usePuzzle from "@/components/hooks/Puzzle"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0) // You'll use this later for animation
  const steps = [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
  ]
  const { puzzle, rotateFace: rotatePuzzleFace } = usePuzzle(
    Puzzle.SolvedPuzzle(),
  )

  const [a, setA] = useState<number>(2)
  // window.setA = setA // Expose setA globally for debugging purposes
  // window.rotatePuzzleFace = rotatePuzzleFace // Expose rotatePuzzleFace globally for debugging purposes

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Canvas Section (Left/top) */}
      <div className="fixed h-1/2 w-full md:h-full md:w-1/2">
        <Scene />
      </div>

      {/* 3D */}
      <AddToScene>
        <Common />
        <StaticPuzzle puzzle={puzzle} hiddenFace={a} />
      </AddToScene>

      {/* Steps Section (Right/bottom) */}
      <div className="mt-auto ml-0 flex h-1/2 w-full flex-col gap-4 overflow-y-auto p-4 md:mt-0 md:ml-auto md:h-full md:w-1/2">
        {steps.map((step, index) => (
          <Card
            onMouseDown={() => (
              setCurrentStep(index),
              rotatePuzzleFace(0, false),
              setA(index % 12)
            )}
            key={index}
            className={cn(
              "hover:bg-accent cursor-pointer transition-all duration-300 ease-in-out select-none hover:shadow-lg",
              {
                "ring-2 ring-blue-500": currentStep === index,
              },
            )}
          >
            <CardHeader>
              <CardTitle>
                {index + 1}. {step}
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
