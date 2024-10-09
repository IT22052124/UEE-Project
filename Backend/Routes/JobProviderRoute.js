import express from "express";
import {
  createJobProvider,
  postJob,
  postedJobs,
  deleteJob,
  getJobProviderById
} from "../Controllers/JobProviderController.js"; // Import your user controller

const router = express.Router();

// Create a new user
router.post("/jobProvider", createJobProvider);
router.post("/postJob", postJob);
router.get('/getJobs', postedJobs);
router.delete("/deleteJob/:jobId", deleteJob);
router.get('/job-providers/:id', getJobProviderById);

export default router;
