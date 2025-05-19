import express from "express";
import { createLodge, deleteLodge, getLodge,  uploadPhotos, getLodges, getLodgeAvailability, getOccupiedPositions, updateLodge, setMantenimientoWithComment, eliminarComment } from "../controllers/lodge.js";

const router = express.Router();

//CREATE
router.post("/", createLodge); //poner el verifyAdmin despues

router.put("/:id", updateLodge);
router.put("/comment/:id", setMantenimientoWithComment);
//DELETE
router.delete("/:id", deleteLodge);
router.put("/eliminarComment/:id", eliminarComment);
router.post("/upload/:id", uploadPhotos);

//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);
router.get("/occupied-dates/:id", getLodgeAvailability);

//GET ALL
router.get("/", getLodges);


export default router
