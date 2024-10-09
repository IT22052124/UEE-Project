import { Application } from "../Models/ApplicationModel.js";
import { Job } from "../Models/JobModel.js";

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
    const {  formData, item, user, URL } =
      req.body;

    console.log(req.body);

    // Generate a new job ID
    const latestApplication = await Application.find().sort({ _id: -1 }).limit(1);
    let id;

    if (latestJob.length !== 0) {
      const latestId = parseInt(latestJob[0].ID.slice(1));
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

    // Respond with the saved job details
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error posting job:", error); // Log error details
    res.status(500).json({ message: error.message });
  }
};
