import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app} from '../index.js';
import { connectToTestDB, disconnectFromDB } from './testing_db.js';
import { startTestServer, stopTestServer } from './testing_server.js';

let createdUserId;
let server;

before(async () => {
  await connectToTestDB();
  server = await startTestServer();
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

testnc () => {
  console.log("desconectando BD")
  await disconnectFromDB();
  console.log("Eh")
  process.exit(0);
});


