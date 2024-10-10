import mongoose from "mongoose";

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Comment cannot be empty"],
      trim: true,
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [], // Initialize as an empty array, we will use commentSchema later
  },
  {
    timestamps: true,
  }
);

// Create the Comment model separately
export const Comment = mongoose.model("Comment", commentSchema);

// Update the replies to use the Comment model
commentSchema.add({
  replies: [commentSchema], // Add the replies using the Comment schema
});

// Post Schema
const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: [true, "Please Enter a Post Title"],
      trim: true,
    },
    descriptions: {
      type: String,
      required: [true, "Please Enter a Description"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medias: {
      type: [String],
      default: [],
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema], // This embeds the comments in the post
  },
  {
    timestamps: true,
  }
);

// Create the Post model
export const Post = mongoose.model("Post", postSchema);
