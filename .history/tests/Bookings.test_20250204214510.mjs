import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

process.env.NODE_ENV = 'test';  // Asegura que estamos en pruebas

dotenv.config(); // Cargar las variables de entorno

before(async () => {
  console.log("Iniciando test...");

  // Conectar a la base de datos de test
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s para que el server inicie
});

before(async () => {
  console.log("Iniciando test...");
  await new Promise(resolve => setTimeout(resolve, 1000));  // 🔹 Espera 1s para que el server inicie
});

test('GET /bookings debe devolver estado 200', async () => {
  const response = await request(app).get('/bookings');
  console.log("Respuesta de /bookings:", response.body);  // 🔹 Imprime la respuesta para debug
  assert.strictEqual(response.status, 200);
});

after(async () => {
  await mongoose.connection.close();  // 🔹 Cierra la conexión a MongoDB después del test
});
