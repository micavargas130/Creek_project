import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js';  // Asegúrate de importar `connect`
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';

let lodgeId; // Guardará el ID de la cabaña creada para las pruebas
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

test('PUT /lodges/:id debe actualizar una cabaña', async () => {
    const updatedData = { name: "Cabaña Modificada" };
  
    const response = await request(app).put(`/lodges/${lodgeId}`).send(updatedData);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, updatedData.name);
  });
  
  test('PUT /lodges/set-occupied/:id debe cambiar estado a ocupado', async () => {
    const response = await request(app).put(`/lodges_/`).send({ _id: "67a55c714d36d65c67654fd5"});
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.occupiedBy, "67a55c714d36d65c67654fd5");
  });

  
  test('DELETE /lodges/:id debe eliminar una cabaña', async () => {
    const response = await request(app).delete(`/lodges/${lodgeId}`);
    assert.strictEqual(response.status, 200);
  
  });

  test('Cerrando', async() => {
  console.log("🛑 Finalizando tests de Lodges...");

  await mongoose.connection.close();  // Cierra la conexión

  console.log("✅ Base de datos de testing cerrada.");
  process.exit(0);
});
