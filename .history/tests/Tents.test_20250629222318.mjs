import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js';  // Asegúrate de importar `connect`
import dotenv from 'dotenv';
import { connectToTestDB, disconnectFromDB } from './testing_db.js';
import { startTestServer, stopTestServer } from './testing_server.js';

dotenv.config();
process.env.NODE_ENV = 'test';

let createdTentId; 

before(async () => {
  await connectToTestDB();
});

let createdTentId;
  test("POST /tents debe crear una nueva carpa", async () => {
    const newTent = {
      first_name: "Micaela",
      last_name: "Vargas",
      email: "micaela@gmail.com",
      photo: "380848593",
      dni:"43444120",
      ocupation: "Estudiante",
      checkIn: '2025-10-07T00:00:00.000Z',
      checkOut: '2025-10-11T00:00:00.000Z',
      numberOfAdults: 2,
      numberOfChildren: 3,      
    };

    const response = await request(app).post("/tents").send(newTent);

    createdTentId = response.body._id; 

    assert.strictEqual(response.status, 200);
    assert.ok(response.body._id)
    createdTentId = response.body._id; 
  });

  // 🏕️ **2. Obtener una carpa por ID**
  test("GET /tents/:id debe devolver una carpa", async () => {
    const response = await request(app).get(`/tents/${createdTentId}`);

    console.log("📥 Respuesta GET por ID:", response.body);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body._id, createdTentId);
  });

  // 🏕️ **3. Obtener todas las carpas**
  test("GET /tents debe devolver todas las carpas", async () => {
    const response = await request(app).get("/tents");

    assert.strictEqual(response.status, 200);
  });


   test("GET /tents/occupiedPositions debe devolver posiciones ocupadas", async () => {
        const response = await request(app).get("/tents/occupiedPositions");
    
    
        assert.strictEqual(response.status, 200);
      });

  test("DELETE /tents/:id debe eliminar una carpa", async () => {
    const response = await request(app).delete(`/tents/${createdTentId}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body, "Carpa eliminada");
});

test(async () => {
  await disconnectFromDB();
  await stopTestServer();
});