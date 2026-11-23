import express from "express";
import { changePassword, deleteUser, getUser, getUsers, searchByEmail, updateUser } from "../controllers/user.js";
import { verifyUser, verifyStaff, verifyAdmin} from "../utils/verifyToken.js";
const router = express.Router();

//PUT
router.put("/:id", verifyUser, updateUser);
router.put("/changePassword/:id", verifyUser, changePassword)


//DELETE
router.delete("/:id", verifyAdmin, deleteUser);

//GET
router.get("/:id", verifyUser, getUser);
router.get("/byEmail/:email", verifyStaff, searchByEmail);

//GET ALL
router.get("/", verifyStaff, getUsers);

export default router