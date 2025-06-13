import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import dotenv from 'dotenv';
import User from '../api/models/User.js';

dotenv.config();
process.env.NODE_ENV = 'test';

let authToken;
let createdUserId;
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
  console.log("status", response)
  assert.strictEqual(response.status, 200);
assert.deepStrictEqual(response.body, { success: true });
});

test('Cerrando', async() => {
  if (createdUserId) {
    await User.findByIdAndDelete(createdUserId);
    console.log(`Usuario de prueba con ID ${createdUserId} eliminado de la base de datos.`);
  }
  
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
