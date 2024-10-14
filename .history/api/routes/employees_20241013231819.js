import express from "express";
import { createEmployee, getEmployee,getEmployees,  updateEmployee} from "../controllers/employee.js";


const router = express.Router();

router.put("/:id", updateEmployee); 

//GET
router.get("/:id", getEmployee);

//CREATE
router.post("/", createEmployee); //poner el verifyAdmin despues

//UPDATE

//Para updatear un empleado hay que pasarle el ID y los datos a modificar
//verifyAdmin? 


//GET ALL
router.get("/", getEmployees);

//DELETE


export default router