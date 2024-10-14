import express from "express";
import Tents from "../models/Tents.js"
import { createTent, deleteTent, getTent, getTents, getOccupiedPositions, updateTent } from "../controllers/tent.js";

const router = express.Router();

//POST
router.post("/", createTent);

//GET
router.get("/:id", getTent);
router.get("/occupiedPositions", getOccupiedPositions);
router.delete("/:id", deleteTent);


//PUT
router.put("/:id/updateStatusCompleted", upd);


//GET ALL
router.get("/", getTents);

export default router