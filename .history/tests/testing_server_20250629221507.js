import { app } from '../index.js';

let server;

export const startTestServer = async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${server.address().port}`);
      resolve(server);
    });
  });
};

export const stopTestServer = async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else {
          console.log("🛑 Servidor detenido");
          resolve();
        }
      });
    });
  }
};