"use client"

import Scene from "@/components/dom/Scene"
import Common from "@/components/fiber/Common"
import Puzzle from "@/components/fiber/Puzzle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"

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

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Canvas Section (Left/top) */}
      <div className="fixed h-1/2 w-full md:h-full md:w-1/2">
        <Scene />
      </div>

      {/* 3D */}
      <Common />
      <Puzzle />

      {/* Steps Section (Right/bottom) */}
      <div className="mt-auto ml-0 flex h-1/2 w-full flex-col gap-4 overflow-y-auto p-4 md:mt-0 md:ml-auto md:h-full md:w-1/2">
        {steps.map((step, index) => (
          <Card
            onMouseDown={() => setCurrentStep(index)}
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
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum,
                omnis dicta sapiente error rem ab, corrupti nemo consectetur
                reprehenderit cumque quidem nam iusto quam ipsum soluta
                blanditiis ad eius distinctio.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
