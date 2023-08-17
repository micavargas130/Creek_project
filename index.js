import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./api/routes/auth.js"
import usersRoute from "./api/routes/users.js"
import lodgeRoute from "./api/routes/lodges.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

const app = express();
dotenv.config();
const jwtSecret = process.env.JWT_KEY

const connect = async () => {
 try { 
    await mongoose.connect(process.env.MONGO); //le paso el link asi para que no quede expuesto
    console.log("Connected to mongoDB.")
  } catch (error) {
    throw error;
  }


  
};

//Si la coneccion con la base de datos se pierde, va a intentar volver a conectarse
mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDB disconnected!")
});
mongoose.connection.on("connected", ()=>{
    console.log("mongoDB connected!")
});

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use("/", authRoute);
app.use("/lodges", lodgeRoute);
app.use("/user", usersRoute);


//error handling middlewares
app.use((err,req, res,next)=>{
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  //cuando hay un error manda un json
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack

  })
});



app.listen(3000, ()=>{  //Despues de conectarse a este puerto
    connect()
    console.log("Connected to backend!")

});
