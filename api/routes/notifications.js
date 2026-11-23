import express from "express";
import { createNotification, deleteNotification, getNotification, getNotifications,  updateNotificationViewing, closeNotification, getClosedNotification} from "../controllers/notification.js";
import { verifyToken, verifyStaff } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
//los clientes logueados generan notificaciones al reservar o cancelar
router.post("/", verifyToken, createNotification);
router.post("/close/:notificationId", verifyStaff, closeNotification)

//UPDATE
router.put("/:id", verifyStaff, updateNotificationViewing);


//DELETE
router.delete("/:id", verifyStaff, deleteNotification);


//GET
router.get("/:id", verifyStaff, getNotification);
router.get('/closed/:userId', verifyStaff, getClosedNotification)

//GET ALL
router.get("/", verifyStaff, getNotifications);


export default router