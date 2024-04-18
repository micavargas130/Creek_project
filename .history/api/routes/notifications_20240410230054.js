import express from "express";
import { createNotification, deleteNotification, getNotification, getNotifications, updateNotification } from "../controllers/notification.js";
import {  verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE
router.post("/", createNotification); //poner el verifyAdmin despues

//UPDATE


//DELETE
router.delete("/:id", deleteNotification);


//GET
router.get("/:id", getNotification);

//GET ALL
router.get("/", getNotifications);


export default router