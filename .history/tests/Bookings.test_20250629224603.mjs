import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../index.js'; 
import { connectToTestDB, disconnectFromDB } from './testing_db.js';

let createdBookingId; 


test('POST /bookings debe crear una reserva', async () => {
  const newBooking = {
    lodge: '67b3e8effa36567d56d54d79',
    checkIn: '2025-10-07T00:00:00.000Z',
    checkOut: '2025-10-11T00:00:00.000Z',
    user: '682be492427c566d515638c9',
    numberOfAdults: 1,
    numberOfChildren: 2,
    totalAmount: 5000
  };
  const response = await request(app).post('/bookings/createBooking').send(newBooking);
  assert.strictEqual(response.status, 200);
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

test('DELETE /bookings/:id debe eliminar una reserva', async () => {
  const response = await request(app).delete(`/bookings/${createdBookingId}`);
  assert.strictEqual(response.status, 200);
});

test('Cerrando', async() => {
    await disconnectFromDB();
    process.exit(0);
  });

