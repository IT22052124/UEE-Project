import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter a Username"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Please Enter a Fullname"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter an Email"],
      trim: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please Enter a Password"],
    },
    telephone: {
      type: String,
      required: [true, "Please Enter a Telephone Number"],
      trim: true,
    },
    profilePic: {
      type: String, // URL to the profile picture
      required: false,
      trim: true,
      default: "", // Default to empty string if no profile pic is provided
    },
    communities: [
      {
        communityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Community",
        },
        postIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
          },
        ],
      },
    ],
    profilePosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
