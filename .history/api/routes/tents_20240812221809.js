import express from "express";
import Tents from "../models/Tents.js"
import { createTent, deleteTent, getTent, getTents, getOccupiedPositions, setStatusCompleted } from "../controllers/tent.js";

const router = express.Router();

//POST
router.post("/", createTent);



//PUT
router.put("/:id/updateStatusCompleted", setStatusCompleted);


//GET ALL
router.get("/", getTents);

export default router