module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current", // Esto asegura que Babel use la versión de Node.js actual.
        },
        modules: "commonjs" // Esto hace que Babel convierta los módulos ECMAScript en módulos CommonJS.
      },
    ],
  ],
};

