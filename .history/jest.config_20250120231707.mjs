export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "babel-jest", // Transforma archivos .js y .ts usando Babel
  },
};
