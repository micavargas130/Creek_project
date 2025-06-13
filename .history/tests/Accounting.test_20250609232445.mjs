import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js'; 
import dotenv from 'dotenv';

dotenv.config(); 
process.env.NODE_ENV = 'test';

let createdAccountingId; 
let server;

before(async () => {
  console.log("Iniciando test de Accounting...");

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

test('POST /accounting debe crear un registro contable', async () => {
  const newAccounting = {
    amount: 1000,
    totalAmount: 2000,
    remainingAmount: 1000,
    type: 'Ingreso',
    date: '2025-02-05T00:00:00.000Z',
    lodge: '682fd255d764b1cb65ca39dc',
    status: "pagada",
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

test('Cerrando', async() => {
  
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
    
  }
);
