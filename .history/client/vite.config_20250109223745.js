server: {
  host: true, // Permite conexiones externas
  strictPort: false, // Usa otro puerto si el 5173 está ocupado
  headers: {
    "Access-Control-Allow-Origin": "*", // Permite todas las conexiones
  },
},