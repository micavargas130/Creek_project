import express from "express";
import Lodges from "../models/Lodges.js"
import { createLodge, deleteLodge, getLodge, getLodges, updateLodge } from "../controllers/lodge.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", verifyAdmin, createLodge);

//UPDATE

//Para updatear una cabaña hay que pasarle el ID y los datos a modificar
router.put("/:id", verifyAdmin, updateLodge);

//DELETE
router.delete("/:id", verifyAdmin, deleteLodge);

//GET
router.get("/:id", getLodge);

//GET ALL
router.get("/", getLodges);


export default router