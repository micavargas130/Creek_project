import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import EmployeeModel from '../api/models/Employees.js';
import { app } from '../index.js';
import {  disconnectFromDB } from './testing_db.js';

let createdEmployeeId;
let createdUserId;

console.log("Iniciando tests de Empleados...");


test('POST /employees debe crear un empleado', async () => {
  const newEmployee = {
    email: 'empleadon@example.com',
    first_name: 'Juan',
    last_name: 'Pérez',
    dni: '65234189',
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
  
});

test('DELETE /user/:id debe eliminar una reserva', async () => {
  try {
    if (createdEmployeeId) {
      await EmployeeModel.deleteOne({ _id: createdEmployeeId });
    }

    if (createdUserId) {
      await request(app).delete(`/user/${createdUserId}`);
    }

  } catch (err) {
    console.error("Error eliminando registros de prueba:", err);
  }

});

test('Cerrando', async() => {
    await disconnectFromDB();
    process.exit(0);
  });

