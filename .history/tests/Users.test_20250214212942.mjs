import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { appz } from '../index.js';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';

let createdUserId;

before(async () => {
  console.log("Iniciando test de Users...");

  const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO;

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s para que el server inicie
});

test('POST /register debe registrar un nuevo usuario', async () => {
  const newUser = {
    email: 'pruebaemail@example.com',
    password: 'securepassword',
    first_name: 'Test',
    last_name: 'User',
    phone: '123456789',
    dni: '24880200',
    birthday: '01-01-1999',
    ocupation: 'Tester'
  };
  const response = await request(app).post('/register').send(newUser);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdUserId = response.body._id;
});

test('GET /users/:id debe obtener un usuario por ID', async () => {
  const response = await request(app).get(`/user/${createdUserId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.email, 'pruebaemail@example.com');
});

test('PUT /users/:id debe actualizar un usuario', async () => {
  const updatedData = { first_name: 'UpdatedName' };
  const response = await request(app).put(`/user/${createdUserId}`).send(updatedData);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.first_name, 'UpdatedName');
});

test('PUT /users/changePassword/:id debe cambiar la contraseña del usuario', async () => {
  const newPassword = { password: 'newsecurepassword' };
  const response = await request(app).put(`/user/changePassword/${createdUserId}`).send(newPassword);
  assert.strictEqual(response.status, 200);
});

test('DELETE /users/:id debe eliminar un usuario', async () => {
  const response = await request(app).delete(`/user/${createdUserId}`);
  assert.strictEqual(response.status, 200);
});

after(async () => {
  console.log("🛑 Cerrando conexión a la BD...");
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
    console.log("✅ Conexión cerrada.");
  }
});

