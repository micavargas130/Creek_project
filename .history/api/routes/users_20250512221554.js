import express from "express";
import User from "../models/User.js"
import { changePassword, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin} from "../utils/verifyToken.js";
const router = express.Router();


//CREATE

//UPDATE
router.put("/:id", updateUser);
router.put("/changePassword/:id", changePassword)


//DELETE
router.delete("/:id", deleteUser);

//GET
router.get("/:id", getUser);  //agregar verifyUser para controlar que no entre nadie indebido

//GET ALL
router.get("/", getUsers);

export default router