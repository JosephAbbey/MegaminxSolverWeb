import { Brand } from "~/types/Utils"

export const Mode = {
  SOLVE: 0 as Brand<0, "Mode">,
  PAINT: 1 as Brand<1, "Mode">,
  SCAN: 2 as Brand<2, "Mode">,
} as const

export type Mode = (typeof Mode)[keyof typeof Mode] & {}
