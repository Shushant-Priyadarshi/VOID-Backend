import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node"
import {auth} from "./utils/auth.js"
import userRouter from "./modules/user/user.routes.js"
import postRouter from "./modules/post/post.routes.js"
import followRouter from "./modules/follow/follow.routes.js"
import mentorRouter from "./modules/mentor/mentor.routes.js"
const app = express();
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth))
app.use(express.json());


//routes   
app.use("/api/v1/users", userRouter)     
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", followRouter)
app.use("/api/v1/mentors", mentorRouter)

app.get("/health" , (_,res) =>{
  res.status(200).json({status:"Server Running"})
})

export {app}