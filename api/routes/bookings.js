import express from "express";
import {createBooking, getBookings, deleteBooking} from "../controllers/booking.js"
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

//DELETE
app.delete('/:bookingId', deleteBooking);

export default app