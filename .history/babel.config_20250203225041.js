export const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current", // Esto es necesario para Jest
      },
    },
  ],
];
