"use client"

import { useFrame } from "@react-three/fiber"
import { Group } from "@tweenjs/tween.js"

export const group = new Group()

export function TweenGroup() {
  useFrame(() => {
    group.update()
  })
  return null
}
