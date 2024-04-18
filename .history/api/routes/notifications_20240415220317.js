import express from "express";
import { createNotification, deleteNotification, getNotification, getNotifications,  updateNotificationViewing } from "../controllers/notification.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", createNotification); //poner el verifyAdmin despues

//UPDATE
router.put("/:id", updateNotificationViewing);
app.post('/notifications/close/:notificationId'

//DELETE
router.delete("/:id", deleteNotification);


//GET
router.get("/:id", getNotification);

//GET ALL
router.get("/", getNotifications);


export default router