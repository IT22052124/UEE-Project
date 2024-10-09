import express from "express";
import {
    getAllJobs
} from "../Controllers/JobController.js"; // Import your user controller

const router = express.Router();

router.get('/Jobs', getAllJobs);

export default router;