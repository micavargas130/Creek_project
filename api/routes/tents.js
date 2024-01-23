import express from "express";
import Tents from "../models/Tents.js"
import { createTent, deleteTent, getTent, getTents } from "../controllers/tent.js";

const router = express.Router();

router.post("/", createTent);

router.get("/:id", getTent);
router.delete("/:id", deleteTent);

//GET ALL
router.get("/", getTents);

export default router