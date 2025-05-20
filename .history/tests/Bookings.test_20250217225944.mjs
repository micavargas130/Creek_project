import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js'; 
import dotenv from 'dotenv';

dotenv.config(); 
process.env.NODE_ENV = 'test';

let createdBookingId; // Para almacenar el ID de una reserva creada en los tests
let server;

before(async () => {
  console.log("Iniciando test de Employees...");

  const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO;
  console.log("🌍 Conectando a:", mongoURI);

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  // Inicia el servidor en un puerto dinámico
  server = app.listen(0, () => {
    console.log(`🟢 Servidor de pruebas corriendo en el puerto ${server.address().port}`);
  });

  await new Promise(resolve => setTimeout(resolve, 1000));
});

test('POST /bookings debe crear una reserva', async () => {
  const newBooking = {
    lodge: '67a550b74d36d65c67654fd1',
    checkIn: '2025-10-07T00:00:00.000Z',
    checkOut: '2025-10-11T00:00:00.000Z',
    user: '67a55c714d36d65c67654fd5',
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
  console.log("🛑 Cerrando conexión a la BD...");
    
    if (mongoose.connection.readyState) {
      try {
        await mongoose.connection.close();
        console.log("✅ Conexión cerrada.");
      } catch (err) {
        console.error("❌ Error cerrando la conexión:", err);
      }
    } else {
      console.log("⚠️ Mongoose ya estaba cerrada.");
    }
    process.exit(0);
});
