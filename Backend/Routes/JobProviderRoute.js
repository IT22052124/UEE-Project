import express from "express";
import { createJobProvider } from "../Controllers/JobProviderController.js"; // Import your user controller

const router = express.Router();

// Create a new user
router.post("/jobProvider", createJobProvider);

export default router;
