import {Router} from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import example1Routes from "./public/example1.js";
import example2Routes from "./protected/example2.js";
import chatRoutes from "./protected/chat.js";
import publicUserRoutes from './public/user.public.js';
import privateUserRoutes from './protected/user.protected.js';

const mainRouter = Router();

// ----------- Public Routes (No auth needed) -----------
mainRouter.use("/example1", example1Routes);
mainRouter.use('/user', publicUserRoutes);      


// ----------- Protected Routes -----------
mainRouter.use("/example2", verifyToken, example2Routes);
mainRouter.use("/chat", verifyToken, chatRoutes);
mainRouter.use("/message", verifyToken, messageRoutes); 
mainRouter.use('/user', verifyToken, privateUserRoutes); 


//------------- Admin Routes ---------------

export default mainRouter;
