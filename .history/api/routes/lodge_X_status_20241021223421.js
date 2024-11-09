import express from "express";
import { createEntry, getEntries, getEntry} from "../controllers/lodge_x_status.js";


const router = express.Router();

router.put("/", newEntry); 

//GET
router.get("/:id", getEntry);
router.get("/", getEntries);



export default router