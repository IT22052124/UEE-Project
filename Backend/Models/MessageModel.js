import mongoose from "mongoose";

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Message content cannot be empty"],
      trim: true,
    },
    time: {
      type: String,
      default: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// Create the Message model
export const Message = mongoose.model("Message", messageSchema);
