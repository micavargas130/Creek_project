import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js'; 
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

test('POST /accounting debe crear un registro contable', async () => {
  const newAccounting = {
    amount: 1000,
    totalAmount: 2000,
    remainingAmount: 1000,
    type: 'Ingreso',
    date: '2025-02-05T00:00:00.000Z',
    user: '67a55c714d36d65c67654fd5',
    lodge: '67a550b74d36d65c67654fd1'
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
  const response = await request(app).put(`/accounting/status/${createdAccountingId}`).send({ status: 'pagada' });
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status.status, 'pagada');
});

test('PUT /accounting/comment/:id debe actualizar el comentario', async () => {
  const response = await request(app).put(`/accounting/comment/${createdAccountingId}`).send({ comment: 'Pago actualizado' });
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.comment, 'Pago actualizado');
});

test('GET /accounting/history/:lodgeId debe devolver el historial de pagos', async () => {
  const response = await request(app).get(`/accounting/history/67a550b74d36d65c67654fd1`);
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body));
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
