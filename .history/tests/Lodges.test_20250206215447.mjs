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
    createdBookingId = response.body._id;
});

test('GET /bookings/:id debe devolver una reserva específica', async () => {
    const response = await request(app).get(`/bookings/${createdBookingId}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body._id, createdBookingId);
  });
  
  test('PUT /bookings/:id debe actualizar una reserva', async () => {
    const updateData = { status: 'ocupado' };
    const response = await request(app).put(`/bookings/${createdBookingId}`).send(updateData);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, 'confirmed');
  });
  
  test('DELETE /bookings/:id debe eliminar una reserva', async () => {
    const response = await request(app).delete(`/bookings/${createdBookingId}`);
    assert.strictEqual(response.status, 200);
  });

after(async () => {
  console.log("🛑 Finalizando tests de Lodges...");
  
  await mongoose.connection.dropDatabase(); // Limpia la base de datos después de los tests
  await mongoose.connection.close();  // Cierra la conexión

  console.log("✅ Base de datos de testing cerrada.");
});
