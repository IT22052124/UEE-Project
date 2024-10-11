import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  usersSeen: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ], // List of users who have seen the notification
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);

