import express from "express";
import { newEntry, getEntries, getEntry, getLatestEntry } from "../controllers/lodge_x_status.js";
import { verifyStaff } from "../utils/verifyToken.js";

const router = express.Router();

router.use(verifyStaff);

// POST para crear una nueva entrada
router.post("/", newEntry);

// Me devuelve una entrada individual por su ID
router.get("/", getEntry);

// Me devuelve una entrada individual por su ID
router.get("/:lodgeId", getEntries);

// Me devuelve el ultimo estado (el actual) de la cabaña

router.get("/latest/:lodgeId", getLatestEntry);

export default router;