import express from "express";
import { createNotification, getNotification, getNotifications,  updateNotificationViewing, closeNotification, getClosedNotification, checkToday} from "../controllers/notification.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", createNotification); //poner el verifyAdmin despues
router.post("/close/:notificationId", closeNotification) 

//UPDATE
router.put("/:id", updateNotificationViewing);


//DELETE


//GET
router.get("/:id", getNotification);
router.get('/closed/:userId', getClosedNotification)
router.get('/checkToday', checkToday)

//GET ALL
router.get("/", getNotifications);


export default router