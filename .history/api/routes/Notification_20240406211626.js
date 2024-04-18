import express from "express";
import { createNotification, deleteNotification, getNotification, getNotifications } from "../controllers/notification.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", createNotification); //poner el verifyAdmin despues

//UPDATE

//Para updatear una cabaña hay que pasarle el ID y los datos a modificar
router.put("/:id", verifyAdmin, updateLodge);

//DELETE
router.delete("/:id", deleteLodge);
router.put("/delavailability/:id", deleteLodgesAvailability);
router.put("/deloccupiedBy/:id", deleteOccupiedBy);
router.put("/set-occupied/:id", setOcupado);
router.put("/set-desoccupied/:id", setDesocupada);
router.put("/set-manteined/:id", setMantenimiento);
router.put("/eliminarComment/:id", eliminarComment);

//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);

//GET ALL
router.get("/", getLodges);


export default router