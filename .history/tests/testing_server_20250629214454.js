import { app } from '../index.js';

let server;

export const startTestServer = async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      console.log(`🚀 Servidor de pruebas escuchando en el puerto ${port}`);
      resolve(server);
    });
  });
};

export const stopTestServer = async () => {
  if (server) {
    await server.close();
    console.log("Servidor de pruebas detenido");
  }
};
