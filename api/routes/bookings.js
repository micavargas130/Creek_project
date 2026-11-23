import express from "express";
import {createBooking, getBookings,getBooking, deleteBooking, getBookingByUser, deleteBookingByLodge, setStatusCompleted, setStatusCanceled, setStatusActive} from "../controllers/booking.js"
import { verifyToken, verifyUser, verifyStaff } from "../utils/verifyToken.js";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// POST
//clientes logueados o staff (el controller valida que un cliente reserve para si mismo)
app.post("/createBooking", verifyToken, createBooking);

// PUT
app.put("/:id/updateStatusCompleted", verifyStaff, setStatusCompleted);
app.put("/:id/updateStatusCanceled", verifyToken, setStatusCanceled); //el cliente puede cancelar la suya
app.put("/:id/updateStatusActive", verifyStaff, setStatusActive);

// GET
app.get("/", verifyStaff, getBookings);
app.get("/:userId/bookings", verifyUser, getBookingByUser);
app.get("/:id", verifyStaff, getBooking);

// DELETE
app.delete('/:bookingId', verifyStaff, deleteBooking);
app.delete('/:lodgeId/bookings', verifyStaff, deleteBookingByLodge);

export default app;