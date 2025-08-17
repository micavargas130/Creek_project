import express from "express";
import { login, register, profile, logout, loginWithGoogle } from "../controllers/auth.js";
import cors from "cors"
import cookieParser from "cookie-parser" 

const app = express();

app.use(cors({
    origin: ["https://creek-project-ruby.vercel.app", "https://creek-project.vercel.app", "https://localhost:3000", "https://localhost:3001"],  // Dominio de tu frontend en Vercel
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
app.post("/login/google", loginWithGoogle)
app.post("/logout", logout)
app.post("/complete", loginWithGoogle)




export default app