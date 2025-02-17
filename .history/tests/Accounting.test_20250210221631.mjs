import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js';
import dotenv from 'dotenv';

dotenv.config(); 
process.env.NODE_ENV = 'test';

let createdAccountingId;

before(async () => {
  console.log("Iniciando test de Accounting...");
  const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO;

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); 
});

test('GET /accounting debe devolver estado 200', async () => {
  const response = await request(app).get('/accounting');
  assert.strictEqual(response.status, 200);
});

test('POST /accounting/createAccounting debe crear un registro contable', async () => {
  const newAccounting = {
    amount: 2000,
    totalAmount: 5000,
    remainingAmount: 3000,
    type: "Ingreso",
    date: "2025-10-07T00:00:00.000Z",
    user: "67a55c714d36d65c67654fd5",
    lodge: "67a550b74d36d65c67654fd1",
    comment: "Pago inicial",
    status: "67a55c714d36d65c67654fd2"
  };

  const response = await request(app).post('/accounting/createAccounting').send(newAccounting);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdAccountingId = response.body._id;
});

test('GET /accounting/:id debe devolver un registro contable específico', async () => {
  const response = await request(app).get(`/accounting/${createdAccountingId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body._id, createdAccountingId);
});

test('DELETE /accounting/:id debe eliminar un registro contable', async () => {
  const response = await request(app).delete(`/accounting/${createdAccountingId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.message, "Accounting deleted successfully");
});

after(async () => {
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
