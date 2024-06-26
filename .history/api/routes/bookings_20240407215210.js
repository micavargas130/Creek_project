import express from "express";
import {createBooking, getBookings,getBooking, deleteBooking, getBookingByUser, deleteBookingByLodge, set} from "../controllers/booking.js"
import cors from "cors"

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))


//POST

app.post("/createBooking", createBooking);

//GET

app.get("/", getBookings);
app.get("/:userId/bookings", getBookingByUser);
app.get("/:id", getBooking)

//DELETE
app.delete('/:bookingId', deleteBooking);
app.delete('/:lodgeId/bookings', deleteBookingByLodge);

export default app