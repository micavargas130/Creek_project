import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    'process.env': {}, // Proporciona compatibilidad con algunas bibliotecas de CommonJS
  },
  build: {
    outDir: 'dist',
  },
  envPrefix: 'VITE_', // Asegura que las variables con prefijo VITE_ sean accesibles
});