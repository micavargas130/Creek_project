const express = requiere ("express");
import { changePassword, deleteUser, getUser, getUsers, searchByEmail, updateUser } from "../controllers/user.js";
const router = express.Router();

//PUT
router.put("/:id", updateUser);
router.put("/changePassword/:id", changePassword)


//DELETE
router.delete("/:id", deleteUser);

//GET
router.get("/:id", getUser); 
router.get("/byEmail/:email", searchByEmail); 

//GET ALL
router.get("/", getUsers);

export default router