import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";
import authRoute from "./api/routes/auth.js";
import usersRoute from "./api/routes/users.js";
import tentsRoute from "./api/routes/tents.js";
import notificationsRoute from "./api/routes/notifications.js";
import employeesRoute from "./api/routes/employees.js";
import pricesRoute from "./api/routes/prices.js";
import scheduleRoute from "./api/routes/schedule.js";
import graphsRoute from "./api/routes/graphs.js";
import lodge_x_statusRoute from "./api/routes/lodge_x_status.js";
import lodgeRoute from "./api/routes/lodges.js";
import bookingsRoute from "./api/routes/bookings.js";
import accountingRoute from "./api/routes/accounting.js";
import { fileURLToPath } from 'url';
import http from "http";
import "./api/utils/cronJobs.js";


dotenv.config();
const app = express();
const server = http.createServer(app);

//Conexion a mongo
const connect = async () => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_TEST:", process.env.MONGO_TEST);
  //se fija si conectarse a la bd de prueba o a la de prod
  const mongoURI = process.env.NODE_ENV === "test" ? process.env.MONGO_TEST : process.env.MONGO;
  console.log(`🌍 Conectando a: ${mongoURI}`);

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Conectado a MongoDB (${process.env.NODE_ENV})`);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  const mongoURI = process.env.NODE_ENV === "test" ? process.env.MONGO_TEST : process.env.MONGO;
  console.log(`🌍 Conectando a: ${mongoURI}`);
  console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {

  console.log("MongoDB connected!");
});

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//middleware
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://creek-project.vercel.app',
  'https://creek-project-ruby.vercel.app',
  'https://creek-project.onrender.com',
  'https://web-camping-arroyito-micavargas130s-projects.vercel.app',
  'https://web-camping-arroyito-git-production-micavargas130s-projects.vercel.app',
  'https://creek-project-micavargas130-micavargas130s-projects.vercel.app'
];

// Usar CORS como middleware global
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Ruta para manejar la carga de imágenes
app.post("/lodge/upload", upload.single("photos"), (req, res) => {
  try {
    res.status(200).json({ filePath: `uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ error: "Error al cargar la imagen" });
  }
});


// Rutas
app.use("/notifications", notificationsRoute);
app.use("/employees", employeesRoute);
app.use("/bookings", bookingsRoute);
app.use("/", authRoute);
app.use("/lodges", lodgeRoute);
app.use("/user", usersRoute);
app.use("/prices", pricesRoute);
app.use("/schedule", scheduleRoute);
app.use("/lodge_x_status", lodge_x_statusRoute);
app.use("/tents", tentsRoute);
app.use("/accounting", accountingRoute);
app.use("/graphs", graphsRoute);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  });
});

// Conectar y escuchar en el puerto
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connect(); // Se conecta a MONGO o MONGO_TEST según entorno

  app.listen(PORT, () => {
    console.log(`✅ Backend escuchando en el puerto ${PORT} (modo ${process.env.NODE_ENV})`);
  });
};

startServer();

export { app, connect};