import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
  tsconfig: "./tsconfig.test.json",
}).transform;

const isReport = process.env.TEST_REPORT === "true";

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",

  transform: {
    ...tsJestTransformCfg,
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  reporters: isReport
    ? [
        "default",
        [
          "jest-html-reporter",
          {
            pageTitle: "Task Management – Unit Test Report",
            outputPath: "test-report/index.html",
            includeFailureMsg: true,
            includeConsoleLog: false,
            sort: "status",
            dateFormat: "yyyy-mm-dd HH:MM:ss",
            executionTimeWarningThreshold: 5,
            logo: null,
          },
        ],
      ]
    : ["default"],
};
