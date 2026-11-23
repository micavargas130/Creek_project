import express from "express";
import {
  createSchedule,
  getAllSchedules,
  getScheduleByEmployee,
  updateSchedule,
  deleteSchedule,
  deleteAllSchedules 
} from "../controllers/schedule.js";
import { verifyStaff } from "../utils/verifyToken.js";

const router = express.Router();

router.use(verifyStaff);

// Crear un nuevo horario
router.post("/", createSchedule);

// Obtener todos los horarios
router.get("/", getAllSchedules);

// Obtener horarios por empleado
router.get("/:employeeId", getScheduleByEmployee);

// Actualizar un horario
router.put("/:scheduleId", updateSchedule);

// Eliminar un horario
router.delete("/:scheduleId", deleteSchedule);

export default router;
