process.env.NODE_ENV = 'test';
import { test} from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../index.js'; 
import {connectToTestDB, disconnectFromDB } from './testing_db.js';

test('Inicializar conexión', async () => {
  await connectToTestDB() 
});

let createdAccountingId;
console.log("Iniciando tests de Accounting...");

test('POST /accounting debe crear un registro contable', async () => {
  const newAccounting = {
    amount: 1000,
    totalAmount: 2000,
    remainingAmount: 1000,
    lodge: '6871ba9aa837c69fc3511ad4',
    type: 'Ingreso',
    date: '2025-02-05T00:00:00.000Z',
    status: "parcial",
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

test('Cerrando', async() => {
  await disconnectFromDB();
  process.exit(0);
});