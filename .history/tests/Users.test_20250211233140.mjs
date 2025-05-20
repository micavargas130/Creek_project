import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
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
    email: 'testuser@example.com',
    password: 'securepassword',
    first_name: 'Test',
    last_name: 'User',
    phone: '123456789',
    dni: '12345678',
    birthday: '1990-01-01',
    ocupation: 'Tester'
  };
  const response = await request(app).post('/register').send(newUser);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdUserId = response.body._id;
});

test('GET /users/:id debe obtener un usuario por ID', async () => {
  const response = await request(app).get(`/users/${createdUserId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.email, 'testuser@example.com');
});

test('PUT /users/:id debe actualizar un usuario', async () => {
  const updatedData = { first_name: 'UpdatedName' };
  const response = await request(app).put(`/users/${createdUserId}`).send(updatedData);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.first_name, 'UpdatedName');
});

test('PUT /users/changePassword/:id debe cambiar la contraseña del usuario', async () => {
  const newPassword = { password: 'newsecurepassword' };
  const response = await request(app).put(`/users/changePassword/${createdUserId}`).send(newPassword);
  assert.strictEqual(response.status, 200);
});

test('DELETE /users/:id debe eliminar un usuario', async () => {
  const response = await request(app).delete(`/users/${createdUserId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body, "Usuario eliminado");
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
