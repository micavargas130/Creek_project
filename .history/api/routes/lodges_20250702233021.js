import express from "express";
import { createLodge, deleteLodge, getLodge,  uploadPhotos, getLodges, getLodgeAvailability, getOccupiedPositions, updateLodge } from "../controllers/lodge.js";

const router = express.Router();

//CREATE
router.post("/", createLodge); 
router.put("/:id", updateLodge);

//DELETE
router.delete("/:id", deleteLodge);
router.post("/upload/:id", uploadPhotos);

//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);
router.get("/occupied-dates/:id", getLodgeAvailability);
router.get("/available/", getLodgesByAvailableDat);
//GET ALL
router.get("/", getLodges);

export default router
