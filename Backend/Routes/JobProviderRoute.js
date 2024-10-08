import express from "express";
import {
  createJobProvider,
  postJob,
  postedJobs,
  deleteJob
} from "../Controllers/JobProviderController.js"; // Import your user controller

const router = express.Router();

// Create a new user
router.post("/jobProvider", createJobProvider);
router.post("/postJob", postJob);
router.get('/getJobs', postedJobs);
router.delete("/deleteJob/:jobId", deleteJob);

export default router;
