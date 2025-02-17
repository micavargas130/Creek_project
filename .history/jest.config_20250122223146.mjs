export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest" // Usa babel-jest para transformar archivos JS y TS
  },
};