import Employee from "../models/Employees.js";
import User from "../models/User.js";
import Status from "../models/EmployeeStatus.js";
import bcrypt from "bcryptjs"; // Asegúrate de importar bcrypt

export const createEmployee = async (req, res, next) => {
    const { email, first_name, last_name, dni, phone, birthday, job, base_salary, start_date, photo } = req.body;

    try {
        // Encriptar la contraseña por defecto "0camping" antes de crear el usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("0camping", salt);

        // Crear el usuario con la contraseña encriptada
        const newUser = new User({
            email,
            password: hashedPassword,  // Contraseña encriptada
            first_name,
            last_name,
            dni,
            phone,
            birthday,
            isEmployee: true
        });

        const savedUser = await newUser.save();

        // Obtener el estado por defecto (e.g., "Activo")
        const defaultStatus = await Status.findOne({ name: "Activo" });

        // Crear el empleado asociado al usuario y al estado por defecto
        const newEmployee = new Employee({
            user: savedUser._id,
            job,
            base_salary,
            start_date,
            photo,
            status: defaultStatus._id
        });

        const savedEmployee = await newEmployee.save();

        res.status(200).json(savedEmployee);
    } catch (err) {
        next(err);
    }
};


export const updateEmployee = async (req, res, next) => {
    const { userId, statusName, ...employeeData } = req.body;

    try {
        // Buscar el estado por nombre
        const status = await Status.findOne({ name: statusName });
        if (!status) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }

        // Actualizar los datos del empleado, incluyendo el ID del estado
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { 
            $set: { ...employeeData, status: status._id }  // Guardar el ID del estado encontrado
        }, { new: true });

        if (userId) {
            // Actualizar los datos del usuario si se proporcionan
            const { email, password, first_name, last_name, dni, phone, birthday, occupation } = req.body;
            await User.findByIdAndUpdate(userId, {
                email,
                password,
                first_name,
                last_name,
                dni,
                phone,
                birthday,
                occupation
            }, { new: true });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        next(err);
    }
};



export const getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('user').populate('status');
        res.status(200).json(employee);
    } catch (err) {
        next(err);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('user').populate('status');
        res.status(200).json(employees);
    } catch (err) {
        next(err);
    }
};
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
    email: 'empleado@example.com',
    first_name: 'Juan',
    last_name: 'Pérez',
    dni: '12345678',
    phone: '123456789',
    birthday: '1990-01-01',
    job: 'Recepcionista',
    base_salary: 50000,
    start_date: '2025-02-05',
    photo: 'https://example.com/photo.jpg'
  };

  const response = await request(app).post('/employees').send(newEmployee);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body._id);
  createdEmployeeId = response.body._id;
  createdUserId = response.body.user;
});

test('GET /employees debe devolver estado 200', async () => {
  const response = await request(app).get('/employees');
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
