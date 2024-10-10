import express from "express";
import { getAllJobs, applyJob, checkJob, getJobApplicationsByCompany } from "../Controllers/JobController.js"; // Import your user controller

const router = express.Router();

router.get("/Jobs", getAllJobs);
router.post("/apply", applyJob);
router.get("/check", checkJob);
router.get("/getApplication/:id", getJobApplicationsByCompany);

export default router;
