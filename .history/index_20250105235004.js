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
import lodge_x_statusRoute from "./api/routes/lodge_x_status.js";
import lodgeRoute from "./api/routes/lodges.js";
import bookingsRoute from "./api/routes/bookings.js";
import accountingRoute from "./api/routes/accounting.js";
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//middleware
const allowedOrigins = ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    const normalizedOrigin = origin?.replace(/\/$/, ''); // Elimina la barra final, si existe
    console.log(`Solicitud desde origen (normalizado): ${normalizedOrigin}`); // Para depuración
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true); // Permitir el origen
    } else {
      console.error(`Origen no permitido por CORS: ${normalizedOrigin}`);
      callback(new Error('Origen no permitido por CORS'));
    }
  },
}));

app.use((req, res, next) => {
  const origin = req.headers.origin?.replace(/\/$/, ''); // Normalizar el origen
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // Configurar dinámicamente el origen
    res.header("Access-Control-Allow-Credentials", "true"); // Permitir credenciales
  }
  next();
});
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
app.use("/lodge_x_status", lodge_x_statusRoute);
app.use("/tents", tentsRoute);
app.use("/accounting", accountingRoute);
app.use('/uploads', express.static('uploads'));

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
const PORT = 3000;
app.listen(PORT, () => {
  connect();
  console.log(`Connected to backend on port ${PORT}!`);
});
