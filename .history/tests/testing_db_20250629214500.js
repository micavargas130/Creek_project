import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoURI;

export const connectToTestDB = async () => {
  process.env.NODE_ENV = 'test';
  mongoURI = process.env.MONGO_TEST;

  if (!mongoURI) {
    throw new Error( No se encontró MONGO_TEST en .env");
  }

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Conectado a la base de datos de pruebas");
  }
};

export const disconnectFromDB = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
    console.log("🛑 Conexión a la base de datos cerrada");
  } else {
    console.log("⚠️ La conexión ya estaba cerrada");
  }
};
