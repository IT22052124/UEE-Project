import { Job } from "../Models/JobModel.js";


export const getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs" });
    }
  };
