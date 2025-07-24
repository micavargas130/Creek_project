process.env.NODE_ENV = 'test';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app} from '../index.js';
import {connectToTestDB, disconnectFromDB } from './testing_db.js';

test('Inicializar conexión', async () => {
  await connectToTestDB() 
});


let createdUserId;
console.log("Iniciando tests de Users...");

test('POST /register debe registrar un nuevo usuario', async () => {
  const newUser = {
    email: 'pruebaemail1@example.com',
    password: 'securepassword',
    first_name: 'Test',
    last_name: 'User',
    phone: '123456789',
    dni: '2488200',
    birthday: '01-01-1999',
    ocupation: 'Tester'
  };
  const response = await request(app).post('/register').send(newUser);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdUserId = response.body._id;
});



test('Cerrando', async() => {
    await disconnectFromDB();
    process.exit(0);
  });

