import mongoose from "mongoose";

const jobProviderSchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: [true, "Please Enter an ID"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Please Enter a Company Name"],
      trim: true,
    },
    contactPersonName: {
        type: String,
        required: [true, "Please Enter a Person Name"],
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
    address: {
      type: String,
      required: [true, "Please Enter an Address"],
      trim: true,
    },
    website: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    companyLogo: {
      type: String, // URL to the profile picture
      required: false,
      trim: true,
      default: "", // Default to empty string if no profile pic is provided
    },
  },
  {
    timestamps: true,
  }
);

export const JobProvider = mongoose.model("JobProvider", jobProviderSchema);