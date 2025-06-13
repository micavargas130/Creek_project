import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, connect } from '../index.js';  // Asegúrate de importar `connect`
import dotenv from 'dotenv';


dotenv.config();
process.env.NODE_ENV = 'test';

let lodgeId; // Guardará el ID de la cabaña creada para las pruebas
let server;

before(async () => {
  console.log("Iniciando test de Tents...");

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
    console.log(`Servidor de pruebas corriendo en el puerto ${server.address().port}`);
  });

  await new Promise(resolve => setTimeout(resolve, 1000));
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
  console.log("Cerrando servidor y base de datos...");

  try {
    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
      console.log("✅ Conexión a la base de datos cerrada.");
    }
  } catch (dbError) {
    console.error( Error cerrando la base de datos:", dbError);
  }

  // Cierra el servidor
  try {
    server.close(() => {
      console.log(" Servidor Express cerrado.");
    });
  } catch (serverError) {
    console.error(" Error cerrando el servidor:", serverError);
  }

  process.exit(0);
});
