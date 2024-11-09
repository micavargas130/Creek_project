import express from "express";
import { createEntry, getEntry} from "../controllers/lodge_x_status.js";


const router = express.Router();

router.put("/update/:id", updateEmployee); 

//GET
router.get("/:id", getEntry);

//CREATE
router.post("/", createEmployee); //poner el verifyAdmin despues

//UPDATE

//Para updatear un empleado hay que pasarle el ID y los datos a modificar
//verifyAdmin? 


//GET ALL
router.get("/", getEmployees);

//DELETE


export default router