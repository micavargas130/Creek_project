import express from "express";
import { createEmployee, getEmployee,getEmployees,  updateEmployee, getEmployeeByUserId} from "../controllers/employee.js";


const router = express.Router();

router.put("/update/:id", updateEmployee); 

//GET
router.get("/:id", getEmployee);
router.get("/user/:userId", getEmployeeByUserId);

//CREATE
router.post("/", createEmployee); //poner el verifyAdmin despues

//UPDATE

//Para updatear un empleado hay que pasarle el ID y los datos a modificar
//verifyAdmin? 


//GET ALL
router.get("/", getEmployees);

//DELETE


export default router