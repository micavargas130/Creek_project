import express from "express";
import { newEntry, getEntries, getEntry } from "../controllers/lodge_x_status.js";

const router = express.Router();

// POST para crear una nueva entrada
router.put("/", newEntry);

// GET específico para obtener una entrada individual por su ID
router.get("/", getEntry);

// GET para obtener todas las entradas de un lodge específico usando lodgeId como parámetro de URL
router.get("/:lodgeId", getEntries);

export default router;