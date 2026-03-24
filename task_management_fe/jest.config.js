const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  // CHANGED: React needs JSDOM, not Node, to render components
  testEnvironment: "jest-environment-jsdom", 
  
  transform: {
    ...tsJestTransformCfg,
  },
  
  // ADDED: Loads your custom DOM matchers before tests run
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], 
  
  // ADDED: Tells Jest how to handle CSS/SCSS imports so they don't crash your tests
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
