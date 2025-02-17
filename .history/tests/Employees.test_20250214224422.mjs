import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';

let createdEmployeeId;
let createdUserId;
let finished = false;

before(async () => {
  console.log("Iniciando test de Employees...");

  const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO;

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s para que el server inicie
});

test('POST /employees debe crear un empleado', async () => {
  const newEmployee = {
    email: 'empleadonuevo@example.com',
    first_name: 'Juan',
    last_name: 'Pérez',
    dni: '34559398',
    phone: '123456789',
    birthday: '01-01-1999',
    job: 'Recepcionista',
    base_salary: 50000,
    start_date: '02-05-2025',
  };

  const response = await request(app).post('/employees/').send(newEmployee);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);

  createdEmployeeId = response.body._id;
  createdUserId = response.body.user;
});

test('GET /employees debe devolver estado 200', async () => {
  const response = await request(app).get('/employees/');
  assert.strictEqual(response.status, 200);
});

test('GET /employees/:id debe devolver un empleado específico', async () => {
  const response = await request(app).get(`/employees/${createdEmployeeId}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body._id, createdEmployeeId);
});

test('PUT /employees/update/:id debe actualizar un empleado', async () => {
  const updateData = {
    userId: createdUserId,
    statusName: 'Activo',
    base_salary: 55000
  };
  const response = await request(app).put(`/employees/update/${createdEmployeeId}`).send(updateData);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.base_salary, 55000);
  finished = true
  
});

console.log("🛑 Eliminando registros de prueba...");

  try {
    if (createdEmployeeId) {
      const deleteEmployeeResponse = await request(app).delete(`/employees/${createdEmployeeId}`);
      console.log("🗑 Empleado eliminado:", deleteEmployeeResponse.body);
    }

    if (createdUserId) {
      const deleteUserResponse = await request(app).delete(`/user/${createdUserId}`);
      console.log("🗑 Usuario eliminado:", deleteUserResponse.body);
    }

    if (mongoose.connection.readyState) {
      const dbName = mongoose.connection.db.databaseName;
      if (dbName !== 'camping_db') {
        await mongoose.connection.db.dropDatabase();
        console.log("🗑 Base de datos de prueba eliminada.");
      } else {
        console.error("⚠️ Error: Intento de borrar la base de datos real!");
      }
      await mongoose.connection.close();
      console.log("✅ Conexión a la base de datos cerrada.");
    }
  } catch (err) {
    console.error("❌ Error eliminando registros de prueba:", err);
  }

