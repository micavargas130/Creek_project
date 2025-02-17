import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';

let lodgeId; // Guardará el ID de la cabaña creada para las pruebas

before(async () => {
  console.log("Iniciando tests de Lodges...");

  const mongoURI = process.env.MONGO_TEST;
  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
});

test('GET /lodges debe devolver estado 200 y un array', async () => {
  const response = await request(app).get('/lodges');
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test('POST /lodges debe crear una cabaña', async () => {
  const newLodge = {
    name: "Cabaña Test",
    description: "test",
    services: "test"
    location: "Sector A",
    capacity: 4
  };

  const response = await request(app).post('/lodges').send(newLodge);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.name, newLodge.name);
  lodgeId = response.body._id; // Guardar el ID para pruebas futuras
});

test('PUT /lodges/:id debe actualizar una cabaña', async () => {
  const updatedData = { name: "Cabaña Modificada" };

  const response = await request(app).put(`/lodges/${lodgeId}`).send(updatedData);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.name, updatedData.name);
});

test('PUT /lodges/set-occupied/:id debe cambiar estado a ocupado', async () => {
  const response = await request(app).put(`/lodges/set-occupied/${lodgeId}`).send({ _id: "12345" });
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.occupiedBy, "12345");
});

test('PUT /lodges/set-desoccupied/:id debe cambiar estado a desocupado', async () => {
  const response = await request(app).put(`/lodges/set-desoccupied/${lodgeId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.occupiedBy, undefined);
});

test('DELETE /lodges/:id debe eliminar una cabaña', async () => {
  const response = await request(app).delete(`/lodges/${lodgeId}`);
  assert.strictEqual(response.status, 200);

  const checkResponse = await request(app).get(`/lodges/${lodgeId}`);
  assert.strictEqual(checkResponse.status, 404);
});

after(async () => {
  console.log("Finalizando tests de Lodges...");
  await mongoose.connection.close();
});
