export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.[jt]s", "**/?(*.)+(spec|test).[tj]s"],
  transform: {
    "^.+\\.[tj]s?$": "babel-jest", // Usa babel-jest para transformar código
  },
};
