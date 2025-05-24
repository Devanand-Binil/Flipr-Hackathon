import {Router} from "express";
import  authRoutes from "./auth.routes.js";
import channelRoutes from "./channel.routes.js";
import messageRoutes from "./message.routes.js";
import uploadRoutes from "./upload.routes.js";
import userRoutes from "./user.routes.js";
const mainRouter = Router();

// ----------- Public Routes (No auth needed) -----------
mainRouter.use("/auth", authRoutes); 
mainRouter.use("/channels", channelRoutes);
mainRouter.use("/messages", messageRoutes); 
mainRouter.use("/upload", uploadRoutes); 
mainRouter.use("/users", userRoutes); 
// ----------- Protected Routes -----------


//------------- Admin Routes ---------------

export default mainRouter;
