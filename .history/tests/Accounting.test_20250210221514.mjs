import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import dotenv from 'dotenv';

dotenv.config(); 
process.env.NODE_ENV = 'test';

let createdBookingId; // Para almacenar el ID de una reserva creada en los tests

before(async () => {
  console.log("Iniciando test...");

  const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO;

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s para que el server inicie
});

test('POST /bookings debe crear una reserva', async () => {
  const newBooking = {
    user: '65ab12345678901234567890',
    lodge: '65cd98765432109876543210',
    checkInDate: '2025-06-15',
    checkOutDate: '2025-06-20',
    status: 'pending'
  };
  const response = await request(app).post('/bookings').send(newBooking);
  assert.strictEqual(response.status, 201);
  assert.ok(response.body._id);
  createdBookingId = response.body._id;
});

test('GET /bookings debe devolver estado 200', async () => {
    const response = await request(app).get('/bookings');
    assert.strictEqual(response.status, 200);
  });
  
test('GET /bookings/:id debe devolver una reserva específica', async () => {
  const response = await request(app).get(`/bookings/${createdBookingId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body._id, createdBookingId);
});

test('PUT /bookings/:id debe actualizar una reserva', async () => {
  const updateData = { status: 'confirmed' };
  const response = await request(app).put(`/bookings/${createdBookingId}`).send(updateData);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status, 'confirmed');
});

test('DELETE /bookings/:id debe eliminar una reserva', async () => {
  const response = await request(app).delete(`/bookings/${createdBookingId}`);
  assert.strictEqual(response.status, 200);
});

after(async () => {
  if (mongoose.connection.readyState) {
    const dbName = mongoose.connection.db.databaseName;
    if (dbName !== 'camping_db') {
      await mongoose.connection.db.dropDatabase();
    } else {
      console.error("⚠️ Error: Intento de borrar la base de datos real!");
    }
    await mongoose.connection.close();
  }
});
