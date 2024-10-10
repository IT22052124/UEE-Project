import express from "express";
import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getUnenrolledPrograms,
  getEnrolledPrograms,
  enrollUserInProgram
} from "../Controllers/ProgramController.js"; // Import your user controller

const router = express.Router();

// Route to create a new community program
router.post('/', createProgram);

// Route to get all community programs
router.get('/programs', getPrograms);

// Route to get a single program by ID
router.get('/programs/:id', getProgramById);

// Route to update a program by ID
router.put('/programs/:id', updateProgram);

// Route to delete a program by ID
router.delete('/programs/:id', deleteProgram);

router.get('/unenrolled-programs', getUnenrolledPrograms);
router.put('/enroll', enrollUserInProgram);
router.get('/enrolled-programs', getEnrolledPrograms);
export default router;
