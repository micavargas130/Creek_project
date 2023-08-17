import express from "express";
import User from "../models/User.js"
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin} from "../utils/verifyToken.js";
const router = express.Router();


//CREATE

//UPDATE
router.put("/:id", verifyUser, updateUser);

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

router.get("/:id", verifyUser, getUser);

//GET ALL
router.get("/", verifyAdmin, getUsers);

export default router