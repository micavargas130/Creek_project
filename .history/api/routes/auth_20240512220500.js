import express from "express";
import { login, register, profile, logout } from "../controllers/auth.js";
import cors from "cors"
import cookieParser from "cookie-parser" 

const app = express();

app.use(cookieParser());


//GET
app.get("/", (req, res) => {
    res.send("Hello, this is auth endpoint")
});
app.get("/profile", profile)

//POST
app.post("/register", register)
app.post("/login", login)
app.post("/logout",'/profile', verifyToken logout)





export default app