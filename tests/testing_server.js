import { app } from '../index.js';

let server = null; // ← variable compartida interna

export const startTestServer = async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      console.log(`🚀 Servidor de pruebas escuchando en el puerto ${port}`);
      resolve(server); // podés devolverlo si querés, pero ya se guarda internamente
    });
  });
};

export const stopTestServer = async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error("❌ Error al cerrar servidor:", err);
          reject(err);
        } else {
          console.log("🛑 Servidor detenido");
          resolve();
        }
      });
    });
  } else {
    console.warn("⚠️ No hay servidor para cerrar");
  }
};
