import { test, expect, describe } from "@jest/globals"
import { Puzzle, PuzzleColor } from "~/types/Puzzle"

function testLayer0(puzzle: Puzzle) {
  expect(puzzle.faces[PuzzleColor.WHITE].edges[0]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].edges[1]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].edges[2]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].edges[3]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].edges[4]).toBe(PuzzleColor.WHITE)

  expect(puzzle.faces[PuzzleColor.RED].edges[0]).toBe(PuzzleColor.RED)
  expect(puzzle.faces[PuzzleColor.BLUE].edges[0]).toBe(PuzzleColor.BLUE)
  expect(puzzle.faces[PuzzleColor.YELLOW].edges[0]).toBe(PuzzleColor.YELLOW)
  expect(puzzle.faces[PuzzleColor.PURPLE].edges[0]).toBe(PuzzleColor.PURPLE)
  expect(puzzle.faces[PuzzleColor.GREEN].edges[0]).toBe(PuzzleColor.GREEN)
}

function testLayer1(puzzle: Puzzle) {
  testLayer0(puzzle)

  expect(puzzle.faces[PuzzleColor.WHITE].corners[0]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].corners[1]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].corners[2]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].corners[3]).toBe(PuzzleColor.WHITE)
  expect(puzzle.faces[PuzzleColor.WHITE].corners[4]).toBe(PuzzleColor.WHITE)

  expect(puzzle.faces[PuzzleColor.RED].corners[0]).toBe(PuzzleColor.RED)
  expect(puzzle.faces[PuzzleColor.BLUE].corners[0]).toBe(PuzzleColor.BLUE)
  expect(puzzle.faces[PuzzleColor.YELLOW].corners[0]).toBe(PuzzleColor.YELLOW)
  expect(puzzle.faces[PuzzleColor.PURPLE].corners[0]).toBe(PuzzleColor.PURPLE)
  expect(puzzle.faces[PuzzleColor.GREEN].corners[0]).toBe(PuzzleColor.GREEN)
}

function testLayer2(puzzle: Puzzle) {
  testLayer1(puzzle)

  expect(puzzle.faces[PuzzleColor.RED].edges[1]).toBe(PuzzleColor.RED)
  expect(puzzle.faces[PuzzleColor.BLUE].edges[1]).toBe(PuzzleColor.BLUE)
  expect(puzzle.faces[PuzzleColor.YELLOW].edges[1]).toBe(PuzzleColor.YELLOW)
  expect(puzzle.faces[PuzzleColor.PURPLE].edges[1]).toBe(PuzzleColor.PURPLE)
  expect(puzzle.faces[PuzzleColor.GREEN].edges[1]).toBe(PuzzleColor.GREEN)

  expect(puzzle.faces[PuzzleColor.RED].edges[4]).toBe(PuzzleColor.RED)
  expect(puzzle.faces[PuzzleColor.BLUE].edges[4]).toBe(PuzzleColor.BLUE)
  expect(puzzle.faces[PuzzleColor.YELLOW].edges[4]).toBe(PuzzleColor.YELLOW)
  expect(puzzle.faces[PuzzleColor.PURPLE].edges[4]).toBe(PuzzleColor.PURPLE)
  expect(puzzle.faces[PuzzleColor.GREEN].edges[4]).toBe(PuzzleColor.GREEN)
}

function testLayer3(puzzle: Puzzle) {
  testLayer2(puzzle)
}

function testLayer4(puzzle: Puzzle) {
  testLayer3(puzzle)
}

function testLayer5(puzzle: Puzzle) {
  testLayer4(puzzle)
}

function testLayer6(puzzle: Puzzle) {
  testLayer5(puzzle)
}

function testLayer7(puzzle: Puzzle) {
  testLayer6(puzzle)
}

function testLayer8(puzzle: Puzzle) {
  testLayer7(puzzle)
}

describe("Puzzle", () => {
  const puzzles = Array.from({ length: 40 }, () => {
    const puzzle = Puzzle.ScrambledPuzzle()
    return [puzzle] as [Puzzle]
  })

  test.each(puzzles)("level0 %# %s", (puzzle) => {
    puzzle.layer0()
    testLayer0(puzzle)
    // if (Math.random() < 0.5) expect(0).toBe(1)
  })

  test.each(puzzles)("level1 %# %s", (puzzle) => {
    puzzle.layer1()
    testLayer1(puzzle)
  })

  test.skip.each(puzzles)("level2 %# %s", (puzzle) => {
    puzzle.layer2()
    testLayer2(puzzle)
  })

  test.skip.each(puzzles)("level3 %# %s", (puzzle) => {
    puzzle.layer3()
    testLayer3(puzzle)
  })

  test.skip.each(puzzles)("level4 %# %s", (puzzle) => {
    puzzle.layer4()
    testLayer4(puzzle)
  })

  test.skip.each(puzzles)("level5 %# %s", (puzzle) => {
    puzzle.layer5()
    testLayer5(puzzle)
  })

  test.skip.each(puzzles)("level6 %# %s", (puzzle) => {
    puzzle.layer6()
    testLayer6(puzzle)
  })

  test.skip.each(puzzles)("level7 %# %s", (puzzle) => {
    puzzle.layer7()
    testLayer7(puzzle)
  })

  test.skip.each(puzzles)("level8 %# %s", (puzzle) => {
    puzzle.layer8()
    testLayer8(puzzle)
  })
})

describe("TrackingPuzzle", () => {
  test("getOptimisedTurns", () => {
    const puzzle = Puzzle.SolvedPuzzle()
    const trackingPuzzle = puzzle.getTrackingPuzzle()

    // 200 turns
    trackingPuzzle.scramble().scramble()

    const optimisedTurns = trackingPuzzle.getOptimisedTurns()

    const testPuzzle = Puzzle.SolvedPuzzle()

    for (const turn of optimisedTurns) {
      testPuzzle.turn(turn)
    }

    expect(testPuzzle).toEqual(puzzle)
  })
})
