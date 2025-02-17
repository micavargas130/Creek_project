module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current", 
        },
        modules: "commonjs"  // Convierte los módulos ECMAScript a CommonJS
      },
    ],
  ],
};

