import express from "express";
import { createLodge, deleteLodge, getLodge, getLodgesByAvailableDate, deletePhoto, uploadPhotos, getLodges, getLodgeAvailability, getOccupiedPositions, updateLodge } from "../controllers/lodge.js";
import { verifyStaff } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyStaff, createLodge);
router.put("/:id", verifyStaff, updateLodge);

//DELETE
router.post("/deletePhoto/:id", verifyStaff, deletePhoto);
router.post("/upload/:id", verifyStaff, uploadPhotos);
router.delete("/:id", verifyStaff, deleteLodge);

//GET (publicos, los usa la web de clientes)
router.get("/available/", getLodgesByAvailableDate);
router.get("/occupiedPositions", getOccupiedPositions);
router.get("/occupied-dates/:id", getLodgeAvailability);
router.get("/", getLodges);
router.get("/:id", getLodge); 


export default router
