import express from "express";
import { getAllJobs, applyJob, checkJob } from "../Controllers/JobController.js"; // Import your user controller

const router = express.Router();

router.get("/Jobs", getAllJobs);
router.post("/apply", applyJob);
router.get("/check", checkJob);

export default router;
