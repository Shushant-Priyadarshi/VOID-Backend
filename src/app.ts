import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node"
import {auth} from "./utils/auth.js"

const app = express();
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Mount all better-auth routes — must be BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json());


//routes


app.get("/health" , (_,res) =>{
  res.status(200).json({status:"ok from server"})
})

export {app}