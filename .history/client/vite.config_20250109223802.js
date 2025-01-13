import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite conexiones externas
    strictPort: false, // Usa otro puerto si el 5173 está ocupado
    headers: {
      "Access-Control-Allow-Origin": "*", // Permite todas las conexiones
    },
  },
})
