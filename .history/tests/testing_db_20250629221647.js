import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoURI;

export const connectToTestDB = async () => {
  process.env.NODE_ENV = 'test';
  mongoURI = process.env.MONGO_TEST;

  if (!mongoURI) {
    throw new Error("No se encontró MONGO_TEST en .env");
  }

  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado a la base de datos de pruebas");
  }
};

export const disconnectFromDB = async () => {
    console.log("Cerrando");

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
};
