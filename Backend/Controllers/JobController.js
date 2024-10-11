import { Application } from "../Models/ApplicationModel.js";
import { Job } from "../Models/JobModel.js";
import { Notification } from "../Models/NotificationModel.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ _id: -1 }) // Sort by the most recent jobs first (assuming _id reflects creation order)
      .populate("postedBy"); // Populating the 'postedBy' field with the related data

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { formData, item, user, URL } = req.body;

    console.log(req.body);

    // Generate a new job ID
    const latestApplication = await Application.find()
      .sort({ _id: -1 })
      .limit(1);
    let id;

    if (latestApplication.length !== 0) {
      const latestId = parseInt(latestApplication[0].ID.slice(1));
      id = "A" + String(latestId + 1).padStart(4, "0");
    } else {
      id = "A0001";
    }

    // Create a new job instance
    const newApplication = new Application({
      ID: id,
      firstname: formData.firstName,
      lastName: formData.lastName,
      resume: URL,
      applicantID: user,
      JobID: item._id,
      jobTitle: item.title,
      companyName: item.postedBy.companyName,
      companyEmail: item.postedBy.email,
      companyLogo: item.postedBy.companyLogo,
    });

    // Save the new job to the database
    const savedApplication = await newApplication.save();

    await Job.updateOne(
      { _id: item._id }, // Find the job by its JobID (item._id)
      { $inc: { applications: 1 } } // Increment 'applications' by 1
    );

    // Respond with the saved job details
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error("Error posting job:", error); // Log error details
    res.status(500).json({ message: error.message });
  }
};

export const checkJob = async (req, res) => {
  try {
    const { item, user } = req.query;

    // Check if the application already exists in the database
    const applicationExists = await Application.findOne({
      applicantID: user,
      JobID: item._id,
    });

    if (applicationExists) {
      return res.status(200).json({
        message: "User has already applied for this job",
        applied: true,
      });
    } else {
      return res.status(200).json({
        message: "User has not applied for this job",
        applied: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error checking application status",
      error: error.message,
    });
  }
};

export const getJobApplicationsByCompany = async (req, res) => {
  try {
    const { id } = req.params; // Assuming company ID is passed as a URL parameter

    // Step 1: Find all jobs posted by the company
    const jobs = await Job.find({ postedBy: id });
    const jobIds = jobs.map((job) => job._id);

    // Step 2: Find applications where JobID is one of the jobIds
    const applications = await Application.find({ JobID: { $in: jobIds } })
      .populate({
        path: "JobID", // Populate JobID details
        populate: { path: "postedBy" }, // Nested populate for company details
      })
      .sort({ _id: -1 }); // Sort by latest application first

    // Step 3: Respond with the applications
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplicationsByUser = async (req, res) => {
  try {
    const { id } = req.params; // Assuming applicant ID is passed as a URL parameter
    // Step 1: Find applications for the specified applicant
    const applications = await Application.find({ applicantID: id }) // Filter by applicant ID
      .populate({
        path: "JobID", // Populate JobID details
        populate: { path: "postedBy" }, // Nested populate for company details
      })
      .sort({ _id: -1 }); // Sort by latest application first

    // Step 2: Respond with the applications
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;


    const application = await Application.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user;

    // Find notifications that the user hasn't seen yet
    const notifications = await Notification.find({
      usersSeen: { $ne: userId },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsSeen = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user;

    // Add the user's ID to the usersSeen array
    await Notification.findByIdAndUpdate(notificationId, {
      $addToSet: { usersSeen: userId },
    });

    res.status(200).json({ message: 'Notification marked as seen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

