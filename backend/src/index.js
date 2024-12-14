import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";

const app=express();
dotenv.config();
const port=process.env.PORT;


app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);





app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    connectDB();
});