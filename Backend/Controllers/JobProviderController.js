import { Job } from "../Models/JobModel.js";
import { JobProvider } from "../Models/JobProviderModel.js"; // Import the JobProvider model
import bcrypt from "bcrypt";
import { Notification } from "../Models/NotificationModel.js";

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

export const jobProviderLogin = async (req, res) => {
  const { password, email } = req.body;

  try {
    // Convert the email from the request to lowercase for case-insensitive comparison
    const lowerCaseEmail = email.toLowerCase();

    // Use $regex with 'i' flag to perform a case-insensitive search
    const user = await JobProvider.findOne({
      email: { $regex: new RegExp(`^${lowerCaseEmail}$`, "i") },
    });

    if (user) {
      // If email exists, check if the password matches the hashed password
      const isMatch = await bcrypt.compare(password, user.password); // Compare the passwords

      if (isMatch) {
        // Passwords match, login successful
        return res.json({
          success: true,
          user, // Return user data
        });
      } else {
        // Password doesn't match
        return res.json({
          success: false,
          message: "Invalid password",
        });
      }
    } else {
      // If email doesn't exist
      return res.json({
        success: false,
        message: "Email not found",
      });
    }
  } catch (error) {
    console.error("Error sign in", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const postJob = async (req, res) => {
  try {
    const { jobTitle, jobDescription, location, salary, skills, user } =
      req.body;

    // Validate that skills is an array
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array." });
    }

    // Generate a new job ID
    const latestJob = await Job.find().sort({ _id: -1 }).limit(1);
    let id;

    if (latestJob.length !== 0) {
      const latestId = parseInt(latestJob[0].ID.slice(1));
      id = "J" + String(latestId + 1).padStart(4, "0");
    } else {
      id = "J0001";
    }

    // Create a new job instance
    const newJob = new Job({
      ID: id,
      title: jobTitle,
      description: jobDescription,
      location: location,
      salary: salary,
      skills: skills, // Skills array from the frontend
      postedBy: user,
    });

    // Save the new job to the database
    const savedJob = await newJob.save();

    // Create a notification for the newly posted job
    try {
      await Notification.create({
        message: `New job posted: ${jobTitle}`,
        jobId: savedJob._id, // Use saved job's ID for the notification
      });
    } catch (error) {
      console.error("Error creating notification:", error.message);
    }

    // Respond with the saved job details
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error posting job:", error); // Log error details
    res.status(500).json({ message: error.message });
  }
};

export const postedJobs = async (req, res) => {
  const { userId } = req.query;
  try {
    const jobs = await Job.find({ postedBy: userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Extract jobId from request parameters

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    // Send success response
    res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the job." });
  }
};

export const getJobProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobProvider = await JobProvider.findOne({ _id: id });

    if (!jobProvider) {
      return res.status(404).json({ message: "Job provider not found" });
    }

    res.status(200).json(jobProvider);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getJobById = async (req, res) => {
  console.log(req.params.id);
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJobById = async (req, res) => {
  const { jobTitle, jobDescription, location, salary, skills } = req.body;

  // Create an object to hold the fields to be updated
  const updateData = {};

  // Map frontend names to schema fields
  if (jobTitle) updateData.title = jobTitle; // Map jobTitle to title
  if (jobDescription) updateData.description = jobDescription; // Map jobDescription to description
  if (location) updateData.location = location; // Keep location as is
  if (salary !== undefined) updateData.salary = salary; // Allow salary to be updated to zero if needed
  if (Array.isArray(skills) && skills.length > 0) updateData.skills = skills; // Ensure skills is an array with at least one skill

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return the updated job and run validators
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};
