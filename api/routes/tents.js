import express from "express";
import { createTent, deleteTent, getTent, getTents, getOccupiedPositions, updateTent } from "../controllers/tent.js";
import { verifyStaff } from "../utils/verifyToken.js";

const router = express.Router();

//las carpas tienen datos personales de los huespedes, solo staff
router.use(verifyStaff);

//POST
router.post("/", createTent);

//GET
router.get("/occupiedPositions", getOccupiedPositions);
router.get("/:id", getTent);

//DELETE
router.delete("/:id", deleteTent);


//PUT
router.put("/:id", updateTent);


//GET ALL
router.get("/", getTents);

export default router