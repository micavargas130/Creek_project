import express from "express";
import {getPrices, getPrice, updatePrices, getLastPrice, createPrice, getPriceByDate} from "../controllers/prices.js";
import { verifyAdmin } from "../utils/verifyToken.js";


const router = express.Router();

router.get("/", getPrices);
router.get("/:id", getPrice);
//los precios se leen sin login (web de clientes) pero solo el admin los modifica
router.put("/:id", verifyAdmin, updatePrices);

router.get("/last/:category", getLastPrice);
router.post("/", verifyAdmin, createPrice);
router.get("/:category/:date", getPriceByDate);

export default router