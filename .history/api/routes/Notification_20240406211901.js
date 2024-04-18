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
router.delete("/:id", deleteNotification);


//GET
router.get("/:id", getNotifications);
router.get("/occupiedPositions", getOccupiedPositions);

//GET ALL
router.get("/", getLodges);


export default router