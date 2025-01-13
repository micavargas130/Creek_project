import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite que el servidor escuche en todas las interfaces (0.0.0.0)
    port: 5173, // Asegúrate de usar el puerto correcto
  },
});