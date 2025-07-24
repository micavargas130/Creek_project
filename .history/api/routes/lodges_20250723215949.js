import express from "express";
import { createLodge, deleteLodge, getLodge, getLodgesByAvailableDate, deletePhoto, uploadPhotos, getLodges, getLodgeAvailability, getOccupiedPositions, updateLodge } from "../controllers/lodge.js";

const router = express.Router();

//CREATE
router.post("/", createLodge); 
router.put("/:id", updateLodge);

//DELETE
router.post("/deletePhoto/:id", deletePhoto);
router.post("/upload/:id", uploadPhotos);
router.delete("/:id", deleteLodge);

//GET
router.get("/available/", getLodgesByAvailableDate);
router.get("/occupiedPositions", getOccupiedPositions);
router.get("/occupied-dates/:id", getLodgeAvailability);
router.get("/", getLodges);
router.get("/:id", getLodge); // <- esta debe ser la última


export default router
