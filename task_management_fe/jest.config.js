import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  // Use jsdom for React/Redux testing
  testEnvironment: "jest-environment-jsdom", 
  
  transform: {
    ...tsJestTransformCfg,
  },
  
  // Ensure this file exists in your src folder
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], 
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"], // 'lcov' is what creates the HTML folder

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
