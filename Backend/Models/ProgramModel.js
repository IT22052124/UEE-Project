import mongoose from "mongoose";

// Create the schema for a community program
const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    enum: [
      'Education',
      'Medical',
      'Employment',
      'Housing',
      'Food Assistance',
      'Community Service',
      'Emergency Response',
    ], // Must be one of these predefined labels
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  locationRedirectUrl: {
    type: String,
    required: true,
    trim: true,
  },
  mapImage: {
    type: [String], // Array of strings to store multiple image URLs
    required: true,
  },
  user_enrollments: [
    {
      email: String,
      status: {
        type: String,
        enum: ['Enrolled', 'Not Enrolled'],
        default: 'Not Enrolled',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Program = mongoose.model("Program", programSchema);
