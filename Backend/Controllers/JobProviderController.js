import { JobProvider } from "../Models/JobProviderModel.js"; // Import the JobProvider model
import bcrypt from "bcrypt";

// Create a new job provider
export const createJobProvider = async (req, res) => {
  try {
    const {
      companyName,
      contactPersonName,
      email,
      telephone,
      password,
      address,
      website,
      companyLogo,
      description,
    } = req.body;

    console.log(req.body);

    // Check if the job provider already exists by email
    const existingProvider = await JobProvider.findOne({ email });
    if (existingProvider) {
      return res
        .status(400)
        .json({ message: "Job provider with this email already exists" });
    }

    // Get the latest JP and generate a new JP ID
    const latestJP = await JobProvider.find().sort({ _id: -1 }).limit(1);
    let id;

    if (latestJP.length !== 0) {
      const latestId = parseInt(latestJP[0].ID.slice(2)); // Assuming ID starts with 'JP'
      id = "JP" + String(latestId + 1).padStart(4, "0");
    } else {
      id = "JP0001";
    }

    // Encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new job provider object
    const newJobProvider = new JobProvider({
      ID: id,
      companyName: companyName,
      contactPersonName: contactPersonName,
      email: email,
      telephone: telephone,
      address: address,
      website: website ? website : null,
      companyLogo: companyLogo ? companyLogo : null,
      description: description ? description : null,
      password: hashedPassword, // Store the hashed password
    });

    // Save the new job provider to the database
    const savedJobProvider = await newJobProvider.save(); // Use save() instead of create()

    // Return the created job provider (excluding password)
    res.status(201).json({
      message: "Job provider created successfully",
      provider: {
        ID: savedJobProvider.ID,
        companyName: savedJobProvider.companyName,
        contactPersonName: savedJobProvider.contactPersonName,
        email: savedJobProvider.email,
        telephone: savedJobProvider.telephone,
        address: savedJobProvider.address,
        website: savedJobProvider.website,
        companyLogo: savedJobProvider.companyLogo,
      },
    });
  } catch (error) {
    console.error("Error creating job provider:", error); // Log error details
    res.status(500).json({ message: error.message });
  }
};
