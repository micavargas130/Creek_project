import express from "express";
import Lodges from "../models/Lodges.js"
import { createLodge, deleteLodge, getLodge, setOcupado, getLodges, getOccupiedPositions, updateLodgesAvailability,deleteLodgesAvailability, updateLodge, updateOccupiedBy, deleteOccupiedBy, setDesocupada, setMantenimiento, setMantenimientoWithComment, eliminarComment } from "../controllers/lodge.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", createLodge); //poner el verifyAdmin despues

//UPDATE

//Para updatear una cabaña hay que pasarle el ID y los datos a modificar
router.put("/:id", updateLodge); //berifyAdmin?
router.put("//availability/", updateLodgesAvailability);
router.put("//occupiedBy/", updateOccupiedBy);
router.put("//comment/", setMantenimientoWithComment);
//DELETE
router.delete("/:id", deleteLodge);
router.put("/:id/delavailability", deleteLodgesAvailability);
router.put("//deloccupiedBy/", deleteOccupiedBy);
router.put("//set-occupied/", setOcupado);
router.put("//set-desoccupied/", setDesocupada);
router.put("//set-manteined/", setMantenimiento);
router.put("//eliminarComment/", eliminarComment);

//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);

//GET ALL
router.get("/", getLodges);


export default router