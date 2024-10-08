import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: [true, "Please Enter an ID"],
      trim: true,
      unique: true, // Ensuring that ID is unique
    },
    title: {
      type: String,
      required: [true, "Please Enter a Title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter a Description"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please Enter a Location"],
      trim: true,
    },
    salary: {
      type: Number, // Changed to Number for better handling of salary
      required: [true, "Please Enter a Salary"],
    },
    skills: {
      type: [String], // Array of strings for skills
      required: [true, "Please Enter at least one skill"], // Ensure at least one skill is provided
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobProvider",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
