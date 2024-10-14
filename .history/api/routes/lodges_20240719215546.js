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
router.put("/:id/availability/", updateLodgesAvailability);
router.put("/:id/occupiedBy/", updateOccupiedBy);
router.put("/:id/comment/", setMantenimientoWithComment);
//DELETE
router.delete("/:id", deleteLodge);
router.put("/:id/delavailability", deleteLodgesAvailability);
router.put("/:id/deloccupiedBy/", deleteOccupiedBy);
router.put("/:id/set-occupied/", setOcupado);
router.put("/:id/set-desoccupied/", setDesocupada);
router.put("/:id/set-manteined/", setMantenimiento);
router.put("/:id/eliminarComment/", eliminarComment);

//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);

//GET ALL
router.get("/", getLodges);


export default router