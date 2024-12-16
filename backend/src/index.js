import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";  // to handle request from frontend
import { app,server } from "./lib/socket.js";

import path from "path";

// const app=express();
// now we import app from socket.js for real time

dotenv.config();
const port=process.env.PORT;

const _dirname=path.resolve();


app.use(express.json());
app.use(cookieParser());

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

// to handle request from frontend
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);





// app.listen(port,()=>{
//     console.log(`server is running on port ${port}`);
//     connectDB();
// });

// for real time replace app with server 
server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    connectDB();
});