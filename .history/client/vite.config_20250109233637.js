import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que el servidor escuche en todas las interfaces
    port: 5173,
    strictPort: true, // Asegúrate de usar siempre este puerto
    hmr: {
      host: 'creek-project.onrender.com', // Especifica el dominio donde está alojado
    },
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: import.meta.env.MODE === 'production', // Solo usar HTTPS en producción
      },
    },
  },
  preview: {
    port: 4173, // Opcional: especifica un puerto para el servidor de vista previa
  },
});

console.log(process.env.VITE_API_URL, process.env.VITE_API_URL_PROD);

