process.env.NODE_ENV = 'test';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app} from '../index.js';
import {disconnectFromDB } from './testing_db.js';
import { adminAuth } from './auth_helper.js';

let createdUserId;
//email y dni unicos para que el test se pueda correr varias veces sobre la misma base
const unique = Date.now();
console.log("Iniciando tests de Users...");

test('POST /register debe registrar un nuevo usuario', async () => {
  const newUser = {
    email: `pruebaemail${unique}@example.com`,
    password: 'securepassword',
    first_name: 'Test',
    last_name: 'User',
    phone: '123456389',
    dni: String(unique),
    birthday: '01-01-1999',
    ocupation: 'Tester'
  };
  const response = await request(app).post('/register').send(newUser);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdUserId = response.body._id;
});

test('POST /register sin dni no choca con otros usuarios sin dni', async () => {
  for (const n of [1, 2]) {
    const response = await request(app).post('/register').send({
      email: `sindni${n}-${unique}@example.com`,
      password: 'securepassword',
      dni: '',
    });
    assert.strictEqual(response.status, 200);
    await request(app).delete(`/user/${response.body._id}`).set('Authorization', adminAuth());
  }
});

test('Cerrando', async() => {
    if (createdUserId) {
      await request(app).delete(`/user/${createdUserId}`).set('Authorization', adminAuth());
    }
    await disconnectFromDB();
    process.exit(0);
  });
