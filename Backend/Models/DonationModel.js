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
    imageurl:{
      type:String,
      required:false,
    },
    location: {
      type: String,
      required: [true, "Please Enter a Location"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["food", "cloth", "money", "other"],
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
    },
    directCash: {
      type: String,
      required: [false, "Please Specify if Direct Cash is Allowed"],
    },
    organization: {
      type: String,
      required: [true, "Please Enter the Organization Name"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Donation = mongoose.model("Donation", donationSchema);
