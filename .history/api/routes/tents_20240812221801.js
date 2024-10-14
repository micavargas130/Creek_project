import express from "express";
import Tents from "../models/Tents.js"
import { createTent, deleteTent, getTent, getTents, getOccupiedPositions, setStatusCompleted } from "../controllers/tent.js";

const router = express.Router();

//POST
router.post("/", createTent);

//PUT
router.put("/:id/updateStatusCompleted", setStatusCompleted);

//GET

router.get("/occupiedPositions", getOccupiedPositions);
router.delete("/:id", deleteTent);

//GET ALL
router.get("/", getTents);

export default router