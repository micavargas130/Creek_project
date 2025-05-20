module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current", // Esto es necesario para Jest
        },
      },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",  // Esto transforma los módulos ESM a CommonJS
  ],
};
