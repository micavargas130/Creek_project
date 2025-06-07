import express from "express";
import {
   getAccountingEvolution,
  getReservationsByLodge,
  getAverageGuests,
  getAverageStayDuration,
} from "../controllers/graphs.js";

const router = express.Router();

router.get("/evolution", getAccountingEvolution);
router.get("/reservas-tiempo", getReservationsOverTime);
router.get("/reservas-cabana", getReservationsByLodge);
router.get("/promedio-huespedes", getAverageGuests);
router.get("/promedio-estadia", getAverageStayDuration);

export default router;
