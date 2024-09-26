import mongoose from "mongoose";

// Comment Schema
const commentSchema = mongoose.Schema(
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
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Comment model separately
export const Comment = mongoose.model("Comment", commentSchema);

// Post Schema
const postSchema = mongoose.Schema(
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

export const Post = mongoose.model("Post", postSchema);
