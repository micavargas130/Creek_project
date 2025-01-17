import express from "express";
import { login, register, profile, logout } from "../controllers/auth.js";
import cors from "cors"
import cookieParser from "cookie-parser" 

const app = express();

app.use(cors({
    origin: "https://creek-project-ruby.vercel.app/", // Dominio de tu frontend en Vercel
    credentials: true, // Permitir que las cookies sean enviadas
  }));
  
  // Middleware para parsear JSON
  app.use(express.json());

app.use(cookieParser());


//GET
app.get("/", (req, res) => {
    res.send("Hello, this is auth endpoint")
});
app.get("/profile", profile)

//POST
app.post("/register", register)
app.post("/login", login)
app.post("/logout", logout)


export default app