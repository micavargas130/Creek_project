import express from "express";
import {createBooking, getBookings,getBooking, deleteBooking, getBookingByUser, deleteBookingByLodge, setStatusCompleted, setStatusCanceled, setStatusActive} from "../controllers/booking.js"
import cors from "cors"

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// POST
app.post("/createBooking", createBooking);

// PUT
app.put("/:id/updateStatusCompleted", setStatusCompleted);
app.put("/:id/updateStatusCanceled", setStatusCanceled);
app.put("/:id/updateStatusActive", setStatusActive);

// GET
app.get("/", getBookings);
app.get("/:userId/bookings", getBookingByUser);
app.get("/:id", getBooking);

// DELETE
app.delete('/:bookingId', deleteBooking);
app.delete('/:lodgeId/bookings', deleteBookingByLodge);

export default app;