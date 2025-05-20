import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';

let lodgeId; // Guardará el ID de la cabaña creada para las pruebas

before(async () => {
  console.log("Iniciando tests de Lodges...");

  const mongoURI = process.env.MONGO_TEST;
  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
});

test('GET /lodges debe devolver estado 200 y un array', async () => {
  const response = await request(app).get('/lodges');
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test('POST /lodges debe crear una cabaña', async () => {
    const newLodge = {
      name: "Cabaña Test",
      description: "test",
      services: "test",
      capacity: 4
    };
  
    const response = await request(app).post('/lodges').send(newLodge);
    
    console.log("Status:", response.status);
    console.log("Body:", response.body);
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, newLodge.name);
    lodgeId = response.body._id; // Guardar el ID para pruebas futuras
});


after(async () => {
  console.log("Finalizando tests de Lodges...");
  await mongoose.connection.close();
});
