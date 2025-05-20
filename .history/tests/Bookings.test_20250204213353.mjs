import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

process.env.NODE_ENV = 'test';  // Asegura que estamos en pruebas

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
