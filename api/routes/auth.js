import express from "express";
import { login, register, profile, logout, loginWithGoogle, completeProfile } from "../controllers/auth.js";
import { verifyUser } from "../utils/verifyToken.js";

//CORS, JSON y cookies ya se configuran en index.js
const app = express();

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
app.put("/completeProfile/:id", verifyUser, completeProfile)




export default app