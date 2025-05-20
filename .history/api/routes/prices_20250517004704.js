const express = requiere ("express");
const cors  = requiere ("cors");import {getPrices, updatePrices, getLastPrice, createPrice} from "../controllers/prices.js";


const router = express.Router();

//router.post("/", createEmployee); //poner el verifyAdmin despues


router.get("/", getPrices);
//Para updatear un empleado hay que pasarle el ID y los datos a modificar
router.put("/:id", updatePrices); //verifyAdmin? 

router.get("/last/:category", getLastPrice);
router.post("/", createPrice);

export default router