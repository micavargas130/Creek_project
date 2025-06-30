import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js'; 
import dotenv from 'dotenv';

dotenv.config(); 
process.env.NODE_ENV = 'test';

import { connectToTestDB, disconnectFromDB } from './tests/db.js';
import { startTestServer, stopTestServer } from './tests/server.js';

let createdAccountingId;
let server;

before(async () => {
  await connectToTestDB();
  server = await startTestServer();
});

test('POST /accounting debe crear un registro contable', async () => {
  const newAccounting = {
    amount: 1000,
    totalAmount: 2000,
    remainingAmount: 1000,
    lodge: '682be31d427c566d515638c8',
    type: 'Ingreso',
    date: '2025-02-05T00:00:00.000Z',
    status: "pendiente",
  };
  const response = await request(app).post('/accounting/createAccounting').send(newAccounting);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdAccountingId = response.body._id;
});

test('GET /accounting debe devolver estado 200', async () => {
    const response = await request(app).get('/accounting');
    assert.strictEqual(response.status, 200);
  });

test('GET /accounting/:id debe devolver un registro contable específico', async () => {
  const response = await request(app).get(`/accounting/${createdAccountingId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body._id, createdAccountingId);
});


test('PUT /accounting/status/:id debe actualizar el estado de pago', async () => {
  const response = await request(app).put(`/accounting/status/${createdAccountingId}`).send({ status: 'parcial' });
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status.status, 'parcial');
});

test('GET /accounting/filter?filter=month debe devolver contabilidad del mes', async () => {
  const response = await request(app).get('/accounting/filter?filter=month');
  assert.strictEqual(response.status, 200);
  assert.ok(response.body.totalMoney !== undefined);
});

test('DELETE /accounting/:id debe eliminar un registro contable', async () => {
  const response = await request(app).delete(`/accounting/${createdAccountingId}`);
  assert.strictEqual(response.status, 200);
});

after(async () => {
  console.log("Cerrando conexion con BD")
  await disconnectFromDB();
  await stopTestServer();
});
