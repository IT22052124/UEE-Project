import mongoose from "mongoose";

const donationSchema = mongoose.Schema(
  {
    Id: {
      type: String,
      required: true,
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
    amountRaised: {
      type: Number,
      required: [false, "Please Enter the Amount Raised"],
      default: 0,
    },
    amountRequired: {
      type: Number,
      required: [true, "Please Enter the Amount Required"],
    },
    image: {
      type: [String],
      required: false,
    },
    location: {
      type: String,
      required: [true, "Please Enter a Location"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Hunger", "Medical", "Education", "Poverty", "Disaster", "Others"],
      required: [true, "Please Select a Category"],
    },
    bankDetails: {
      accountNumber: {
        type: String,
        required: [false, "Please Enter a Bank Account Number"],
        trim: true,
      },
      bankName: {
        type: String,
        required: [false, "Please Enter a Bank Name"],
        trim: true,
      },
      accountHolderName: {
        type: String,
        required: [false, "Please Enter an Account Holder Name"],
        trim: true,
      },
      bankBranch: {
        type: String,
        required: [false, "Please Enter Branch Name"],
        trim: true,
      },
    },
    directCash: {
      orgName: {
        type: String,
        required: [false, "Please Enter a Bank Account Number"],
        trim: true,
      },
      phone: {
        type: String,
        required: [false, "Please Enter a Bank Name"],
        trim: true,
      },
      address: {
        type: String,
        required: [false, "Please Enter an Account Holder Name"],
        trim: true,
      },
    },
    organization: {
      type: String,
      required: [true, "Please Enter the Organization Name"],
      trim: true,
    },
    emergency: {
      type: String,
      enum: ["yes", "no"],
      required: [false, "Please Select a Category"],
    },
  },
  {
    timestamps: true,
  }
);

export const Donation = mongoose.model("Donation", donationSchema);
