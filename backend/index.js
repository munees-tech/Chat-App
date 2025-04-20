import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./src/lib/db.js";
import authRoute from "./src/routes/auth.roues.js";
import messageRoute from "./src/routes/message.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import { io,server,app } from "./src/lib/socket.js";
import path from "path"

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use("/api/auth",authRoute);
app.use("/api/message",messageRoute);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

server.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    connectDb();
});
