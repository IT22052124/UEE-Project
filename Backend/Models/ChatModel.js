import mongoose from "mongoose";

// Chat Schema
const ChatSchema = new mongoose.Schema({
  chatId: { type: String, unique: true }, // Unique ID for the chat
  participants: [String], // Array of user IDs
  createdAt: { type: Date, default: Date.now },
});

export const Chat = mongoose.model("Chat", ChatSchema);
