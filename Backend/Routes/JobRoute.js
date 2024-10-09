import express from "express";
import { getAllJobs, applyJob } from "../Controllers/JobController.js"; // Import your user controller

const router = express.Router();

router.get("/Jobs", getAllJobs);
router.post("/apply", applyJob);

export default router;
