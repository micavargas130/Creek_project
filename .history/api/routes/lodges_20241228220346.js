import express from "express";
import Lodges from "../models/Lodges.js"
import { createLodge, deleteLodge, getLodge, setOcupado, uploadPhotos, getLodges, getOccupiedDates, getOccupiedPositions, updateLodgesAvailability,deleteLodgesAvailability, updateLodge, deleteOccupiedBy, setDesocupada, setMantenimiento, setMantenimientoWithComment, eliminarComment } from "../controllers/lodge.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", createLodge); //poner el verifyAdmin despues

//UPDATE

//Para updatear una cabaña hay que pasarle el ID y los datos a modificar
router.put("/:id", updateLodge); //berifyAdmin?
router.put("/availability/:id", updateLodgesAvailability);
router.put("/comment/:id", setMantenimientoWithComment);
//DELETE
router.delete("/:id", deleteLodge);
router.put("delavailability/:id", deleteLodgesAvailability);
router.put("/deloccupiedBy/:id", deleteOccupiedBy);
router.put("/set-occupied/:id", setOcupado);
router.put("/set-desoccupied/:id", setDesocupada);
router.put("/set-manteined/:id", setMantenimiento);
router.put("/eliminarComment/:id", eliminarComment);
router.post("/upload/:id", uploadPhotos);

//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);
router.get("/occupied-dates/:id",getOccupiedDates);

//GET ALL
router.get("/", getLodges);


export default router