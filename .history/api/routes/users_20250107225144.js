import express from "express";
import User from "../models/User.js"
import { changePassword, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin} from "../utils/verifyToken.js";
const router = express.Router();


//CREATE

//UPDATE
router.put("/:id", verifyUser, updateUser);
router.put("/changePassword/:id", changePassword)
router.put("role/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
/*router.get("/checkauth", verifyToken, (req,res,next)=>{
    res.send("You are logged in!")
})

router.get("/checkauth/:id", verifyUser, (req,res,next)=>{
    res.send("You are logged in and you can delete your account")
})

router.get("/checkauth/:id", verifyAdmin, (req,res,next)=>{
    res.send("hello admin")
}) */

router.get("/:id", getUser);  //agregar verifyUser para controlar que no entre nadie indebido

//GET ALL
router.get("/", getUsers);

export default router