import express from "express";
import { createEntry, getEntry} from "../controllers/lodge_x_status.js";


const router = express.Router();

router.put("/", createEntry); 

//GET
router.get("/:id", getEntry);




export default router