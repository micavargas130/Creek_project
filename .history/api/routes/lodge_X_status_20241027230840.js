import express from "express";
import { newEntry, getEntries, getEntry } from "../controllers/lodge_x_status.js";

const router = express.Router();

// POST para crear una nueva entrada
router.put("/", newEntry);

// GET específico para obtener una entrada individual por su ID
router.get("/getEntry/:id", getEntry);

// GET para obtener todas las entradas o filtrar por lodgeId usando query params
router.get("/", getEntries);

export default router;