process.env.NODE_ENV = 'test';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../index.js';
import { disconnectFromDB } from './testing_db.js';
import { adminAuth } from './auth_helper.js';

let authCookie;
let authToken;
let createdUserId;
//email y dni unicos para que el test se pueda correr varias veces sobre la misma base
const unique = Date.now();
const email = `usuario${unique}@example.com`;
console.log("Iniciando tests de Auth...");

test('POST /register debe registrar un nuevo usuario', async () => {
  const newUser = {
    email,
    password: 'securepassword',
    first_name: 'Carlos',
    last_name: 'Gómez',
    phone: '987654321',
    dni: String(unique),
    birthday: '1992-06-15',
    ocupation: 'Gerente'
  };
  const response = await request(app).post('/register').send(newUser);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  assert.strictEqual(response.body.password, undefined, 'no debe devolver el hash de la contraseña');
  createdUserId = response.body._id;
});

test('POST /login debe autenticar un usuario y devolver un token', async () => {
  const credentials = {
    email,
    password: 'securepassword'
  };
  const response = await request(app).post('/login').send(credentials);
  assert.strictEqual(response.status, 200);
  assert.ok(response.headers['set-cookie']);
  assert.ok(response.body.token);
  assert.strictEqual(response.body.password, undefined);
  authCookie = response.headers['set-cookie'][0];
  authToken = response.body.token;
});

test('POST /login con contraseña incorrecta debe devolver 400', async () => {
  const response = await request(app).post('/login').send({ email, password: 'incorrecta' });
  assert.strictEqual(response.status, 400);
});

test('GET /profile debe devolver la información del usuario autenticado', async () => {
  const response = await request(app).get('/profile').set('Cookie', authCookie);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.email, email);
});

test('las rutas protegidas sin token devuelven 401', async () => {
  const response = await request(app).get('/bookings');
  assert.strictEqual(response.status, 401);
});

test('un cliente no puede usar rutas del staff', async () => {
  const response = await request(app).get('/bookings').set('Authorization', `Bearer ${authToken}`);
  assert.strictEqual(response.status, 403);
});

test('un cliente no puede ver datos de otro usuario', async () => {
  const response = await request(app).get('/user/000000000000000000000000').set('Authorization', `Bearer ${authToken}`);
  assert.strictEqual(response.status, 403);
});

test('un cliente no puede darse permisos de admin', async () => {
  const response = await request(app)
    .put(`/user/${createdUserId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ phone: 111, isAdmin: true, isEmployee: true });
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.isAdmin, false);
  assert.strictEqual(response.body.isEmployee, false);
});

test('POST /login/google sin credencial valida es rechazado', async () => {
  const response = await request(app).post('/login/google').send({ email, name: 'Falso', googleId: '123' });
  assert.strictEqual(response.status, 400);
});

test('POST /logout debe cerrar la sesión del usuario', async () => {
  const response = await request(app).post('/logout').set('Cookie', authCookie);
  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { success: true });
});

test('Cerrando', async() => {
    if (createdUserId) {
      await request(app).delete(`/user/${createdUserId}`).set('Authorization', adminAuth());
    }
    await disconnectFromDB();
    process.exit(0);
  });
