import express from "express";
import {getPrices, getPrice, updatePrices, getLastPrice, createPrice} from "../controllers/prices.js";


const router = express.Router();

router.get("/", getPrices);
router.get("/:id", getPrice);
//Para updatear un empleado hay que pasarle el ID y los datos a modificar
router.put("/:id", updatePrices); //verifyAdmin? 

router.get("/last/:category", getLastPrice);
router.post("/", createPrice);
router.get("/date", getPriceByDate)

export default router