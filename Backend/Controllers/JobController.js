import { Job } from "../Models/JobModel.js";


export const getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find()
        .sort({ _id: -1 }) // Sort by the most recent jobs first (assuming _id reflects creation order)
        .populate('postedBy'); // Populating the 'postedBy' field with the related data
  
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs" });
    }
  };
  
