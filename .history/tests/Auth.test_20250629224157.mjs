import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../index.js';
import { connectToTestDB, disconnectFromDB } from './testing_db.js';

let authToken;
let createdUserId;

before(async () => {
  console.log("Iniciando tests de Autenticación")
  await connectToTestDB();
});

test('POST /register debe registrar un nuevo usuario', async () => {
  const newUser = {
    email: 'usuario@example.com',
    password: 'securepassword',
    first_name: 'Carlos',
    last_name: 'Gómez',
    phone: '987654321',
    dni: '87654321',
    birthday: '1992-06-15',
    ocupation: 'Gerente'
  };
  const response = await request(app).post('/register').send(newUser);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdUserId = response.body._id;
});

test('POST /login debe autenticar un usuario y devolver un token', async () => {
  const credentials = {
    email: 'usuario@example.com',
    password: 'securepassword'
  };
  const response = await request(app).post('/login').send(credentials);
  assert.strictEqual(response.status, 200);
  assert.ok(response.headers['set-cookie']);
  authToken = response.headers['set-cookie'][0];
});

test('GET /profile debe devolver la información del usuario autenticado', async () => {
  const response = await request(app).get('/profile').set('Cookie', authToken);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.email, 'usuario@example.com');
});

test('POST /logout debe cerrar la sesión del usuario', async () => {
  const response = await request(app).post('/logout').set('Cookie', authToken);
  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { success: true });
});
  
test('Cerrando', async() => {
    await disconnectFromDB();
    process.exit(0);
  });
