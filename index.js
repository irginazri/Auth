import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import userRouter from "./routes/index.js";
dotenv.config()

const app = express();

try {
    await db.authenticate()
    console.log("DB Connected");
} catch (error) {
    console.error(error);
    
}

app.use(cookieParser())
app.use(express.json())
app.use('/user', userRouter)

app.listen(5000,()=>console.log("SERVER RUNNING PORT 5000"));