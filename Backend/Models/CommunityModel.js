import mongoose from "mongoose";

const communitySchema = mongoose.Schema(
  {
    communityName: {
      type: String,
      required: [true, "Please Enter a Community Name"],
      trim: true,
      unique: true,
    },
    communityDescription: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the admin
      required: true,
    },
    communityPic: {
      type: String,
      required: false,
      trim: true,
      default: "", // Default empty string if no picture is provided
    },
    coverPic: {
      type: String, // URL to the community's cover picture
      required: false,
      trim: true,
      default: "", // Default empty string if no cover picture is provided
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
        required: false,
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model for members
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Community = mongoose.model("Community", communitySchema);
