import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js';  // Asegúrate de importar `connect`
import dotenv from 'dotenv';


dotenv.config();
process.env.NODE_ENV = 'test';

let lodgeId; // Guardará el ID de la cabaña creada para las pruebas

before(async () => {
  console.log("🛠 Iniciando tests de Lodges...");

  // Conectar a la BD de test antes de empezar
  await connect();

  console.log("✅ Base de datos de testing conectada.");
});

// Variable para almacenar el ID de la carpa creada
let createdTentId;

describe("Tents API", () => {
  
  // 🏕️ **1. Crear una carpa**
  test("POST /tents debe crear una nueva carpa", async () => {
    const newTent = {
      name: "Carpa Familiar",
      numberOfAdults: 2,
      numberOfChildren: 3,
      location: "A1"
    };

    const response = await request(app).post("/tents").send(newTent);

    console.log("📥 Respuesta de creación:", response.body);

    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe(newTent.name);
    
    createdTentId = response.body._id; // Guardar ID para pruebas siguientes
  });

  // 🏕️ **2. Obtener una carpa por ID**
  test("GET /tents/:id debe devolver una carpa", async () => {
    const response = await request(app).get(`/tents/${createdTentId}`);

    console.log("📥 Respuesta GET por ID:", response.body);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdTentId);
  });

  // 🏕️ **3. Obtener todas las carpas**
  test("GET /tents debe devolver todas las carpas", async () => {
    const response = await request(app).get("/tents");

    console.log("📥 Respuesta GET todas:", response.body);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  // 🏕️ **4. Actualizar una carpa**
  test("PUT /tents/:id debe actualizar una carpa", async () => {
    const updatedData = { name: "Carpa de Lujo" };
    const response = await request(app).put(`/tents/${createdTentId}`).send(updatedData);

    console.log("📥 Respuesta actualización:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
  });

  // 🏕️ **5. Eliminar una carpa**
  test("DELETE /tents/:id debe eliminar una carpa", async () => {
    const response = await request(app).delete(`/tents/${createdTentId}`);

    console.log("📥 Respuesta eliminación:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toBe("Carpa eliminada");
  });

  // 🏕️ **6. Obtener posiciones ocupadas**
  test("GET /tents/occupiedPositions debe devolver posiciones ocupadas", async () => {
    const response = await request(app).get("/tents/occupiedPositions");

    console.log("📥 Respuesta posiciones ocupadas:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("occupiedPositions");
    expect(Array.isArray(response.body.occupiedPositions)).toBeTruthy();
  });

});

after(async () => {
  console.log("🛑 Finalizando tests de Lodges...");
  
  await mongoose.connection.dropDatabase(); // Limpia la base de datos después de los tests
  await mongoose.connection.close();  // Cierra la conexión

  console.log("✅ Base de datos de testing cerrada.");
});
