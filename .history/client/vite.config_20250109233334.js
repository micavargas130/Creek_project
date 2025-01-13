import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
        target: process.env.NODE_ENV === 'production'
          ? 'https://creek-project.onrender.com' // Backend en producción
          : 'http://localhost:3000', // Backend en desarrollo
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production', // Solo usar HTTPS en producción
      },
    
  },
  preview: {
    port: 4173, // Opcional: especifica un puerto para el servidor de vista previa
  },
});
