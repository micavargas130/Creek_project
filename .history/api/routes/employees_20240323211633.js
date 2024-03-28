import express from "express";
import Employee from "../models/Employees.js"
import { createEmployee, deleteEmployee, getEmployee,getEmployees,  updateEmployee} from "../controllers/employee.js";


const router = express.Router();


//CREATE
router.post("/", createLodge); //poner el verifyAdmin despues

//UPDATE

//Para updatear un empleado hay que pasarle el ID y los datos a modificar
router.put("/:id", updateEmployee); //verifyAdmin? 

//DELETE
router.delete("/:id", deleteLodge);


//GET
router.get("/:id", getLodge);
router.get("/occupiedPositions", getOccupiedPositions);

//GET ALL
router.get("/", getLodges);


export default router