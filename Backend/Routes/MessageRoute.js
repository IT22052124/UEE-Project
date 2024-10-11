import express from "express";
import {
  createChatAndFirstMessage,
  retrieveMessages,
} from "../Controllers/MessageController.js";

const router = express.Router();

router.post("/create-chat", createChatAndFirstMessage);

router.get("/messages/:chatId", retrieveMessages);

export default router;
