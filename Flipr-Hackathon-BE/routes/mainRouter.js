import {Router} from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import  authRoutes from "./auth.routes.js";
import channelRoutes from "./channel.routes.js";
import messageRoutes from "./message.routes.js";
import uploadRoutes from "./upload.routes.js";
import userRoutes from "./user.routes.js";
const mainRouter = Router();

// ----------- Public Routes (No auth needed) -----------


// ----------- Protected Routes -----------


//------------- Admin Routes ---------------

export default mainRouter;
