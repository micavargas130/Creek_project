export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testMatch: [
    "**/test/**/*.test.[jt]s", // Busca archivos en la carpeta `test` que terminen con `.test.js` o `.test.ts`
    "**/?(*.)+(spec|test).[tj]s", // También busca otros archivos `.spec.js` o `.test.js`
  ],
};
