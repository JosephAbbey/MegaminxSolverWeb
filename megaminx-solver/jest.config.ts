import type { Config } from "jest"
import nextJest from "next/jest.js"

import { createDefaultEsmPreset } from "ts-jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  ...createDefaultEsmPreset({
    useESM: true,
  }),
  coverageProvider: "v8",
  collectCoverage: true,
  coverageReporters: ["clover", "lcov", "json"],
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
}

export default createJestConfig(config)
