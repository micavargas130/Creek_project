import express from "express";
import {getPrices, getPrice, updatePrices, getLastPrice, createPrice} from "../controllers/prices.js";


const router = express.Router();

//router.post("/", createEmployee); //poner el verifyAdmin despues


router.get("/", getPrices);
router.get("/price/:id", getPrice);
//Para updatear un empleado hay que pasarle el ID y los datos a modificar
router.put("/:id", updatePrices); //verifyAdmin? 

router.get("/last/:category", getLastPrice);
router.post("/", createPrice);

export default router