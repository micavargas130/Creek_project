import express from "express";
import { createAccounting, deleteAccounting, getAccounting, setComment } from "../controllers/accounting.js";

const router = express.Router();

router.post("/createAccounting", createAccounting);
router.put("/comment/:id", setComment);

router.get("/", getAccounting);
router.delete("/:id", deleteAccounting);

//GET ALL
//router.get("/", getTents);

export default router