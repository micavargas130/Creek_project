import express from "express";
import { updatePrices} from "../controllers/prices.js";


const router = express.Router();

//router.post("/", createEmployee); //poner el verifyAdmin despues

//UPDATE

//Para updatear un empleado hay que pasarle el ID y los datos a modificar
router.put("/:id", updatePrices); //verifyAdmin? 


//GET ALL
router.get("/", getEmployees);

//DELETE


export default router