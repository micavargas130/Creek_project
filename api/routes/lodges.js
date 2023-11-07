import express from "express";
import Lodges from "../models/Lodges.js"
import { createLodge, deleteLodge, getLodge, setOcupado, getLodges,updateLodgesAvailability,deleteLodgesAvailability, updateLodge, updateOccupiedBy, deleteOccupiedBy, setDesocupada, setMantenimiento, updateLodgesComment } from "../controllers/lodge.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", verifyAdmin, createLodge);

//UPDATE

//Para updatear una cabaña hay que pasarle el ID y los datos a modificar
router.put("/:id", verifyAdmin, updateLodge);
router.put("/availability/:id", updateLodgesAvailability);
router.put("/occupiedBy/:id", updateOccupiedBy);
router.put("/comment/:id", updateLodgesComment);
//DELETE
router.delete("/:id", verifyAdmin, deleteLodge);
router.put("/delavailability/:id", deleteLodgesAvailability);
router.put("/deloccupiedBy/:id", deleteOccupiedBy);
router.put("/set-occupied/:id", setOcupado);
router.put("/set-desoccupied/:id", setDesocupada);
router.put("/set-manteined/:id", setMantenimiento);

//GET
router.get("/:id", getLodge);

//GET ALL
router.get("/", getLodges);


export default router