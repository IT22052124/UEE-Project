import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: [true, "Please Enter an ID"],
      trim: true,
      unique: true, // Ensuring that ID is unique
    },
    firstname: {
      type: String,
      required: [true, "Please Enter a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please Enter a last name"],
      trim: true,
    },
    resume: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    applicantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    JobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    jobTitle: {
      type: String,
      required: [true, "Please Enter a job title"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Please Enter a compane name"],
      trim: true,
    },
    companyEmail: {
      type: String,
      required: [true, "Please Enter an Email"],
      trim: true,
    },
    companyLogo: {
      type: String, // URL to the profile picture
      required: false,
      trim: true,
      default: "", // Default to empty string if no profile pic is provided
    },
    status: {
      type: String,
      required: true, // "true" as status should always be provided
      enum: ["Pending", "Reviewed"], // Restrict status to "Pending" or "Reviewed"
      default: "Pending", // Default value to "Pending"
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
