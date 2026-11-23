import express from "express";
import { createEmployee, getEmployee,getEmployees,  updateEmployee, getEmployeeByUserId} from "../controllers/employee.js";
import { verifyStaff, verifyAdmin } from "../utils/verifyToken.js";


const router = express.Router();

router.put("/update/:id", verifyAdmin, updateEmployee);

//GET
router.get("/:id", verifyStaff, getEmployee);
router.get("/user/:userId", verifyStaff, getEmployeeByUserId );

//CREATE
router.post("/", verifyAdmin, createEmployee);

//UPDATE



//GET ALL
router.get("/", verifyStaff, getEmployees);

//DELETE


export default router