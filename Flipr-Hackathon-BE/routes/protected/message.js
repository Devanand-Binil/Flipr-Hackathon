import { Router } from "express";
import {
  sendMessage,
  allMessages,
} from "../../controllers/messageControllers.js";

const router = Router();
router.post("/", sendMessage);
router.get("/:chatId", allMessages);
export default router;
