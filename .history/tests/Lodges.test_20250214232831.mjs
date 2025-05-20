import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js';  // Asegúrate de importar `connect`
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';

let lodgeId; // Guardará el ID de la cabaña creada para las pruebas

before(async () => {
  console.log("🛠 Iniciando tests de Lodges...");

  // Conectar a la BD de test antes de empezar
  await connect();

  console.log("✅ Base de datos de testing conectada.");
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
      services: "test",
      capacity: 4
    };
  
    const response = await request(app).post('/lodges').send(newLodge);
    
    console.log("Status:", response.status);
    console.log("Body:", response.body);
    
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
    const response = await request(app).put(`/lodges/set-occupied/${lodgeId}`).send({ _id: "67a55c714d36d65c67654fd5"});
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.occupiedBy, "67a55c714d36d65c67654fd5");
  });
  
  test('PUT /lodges/set-desoccupied/:id debe cambiar estado a desocupado', async () => {
    const response = await request(app).put(`/lodges/set-desoccupied/${lodgeId}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.occupiedBy, undefined);
  });
  
  test('DELETE /lodges/:id debe eliminar una cabaña', async () => {
    const response = await request(app).delete(`/lodges/${lodgeId}`);
    assert.strictEqual(response.status, 200);
  
  });

  test('Cerrando', async() => {
  console.log("🛑 Finalizando tests de Lodges...");
  
  await mongoose.connection.dropDatabase(); // Limpia la base de datos después de los tests
  await mongoose.connection.close();  // Cierra la conexión

  console.log("✅ Base de datos de testing cerrada.");
});
