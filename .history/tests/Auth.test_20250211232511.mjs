import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import dotenv from 'dotenv';
import User from '.../api/models\User.js';

dotenv.config();
process.env.NODE_ENV = 'test';

let authToken;
let createdUserId;

before(async () => {
  console.log("Iniciando test de Auth...");

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
  assert.strictEqual(response.body, true);
});

after(async () => {
  if (createdUserId) {
    await User.findByIdAndDelete(createdUserId);
    console.log(`Usuario de prueba con ID ${createdUserId} eliminado de la base de datos.`);
  }
  
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
