import express from "express";
import {
  createDonation,
  updateDonation,
  deleteDonation,
  getAllDonations,
  getAllDonationsR,
  getDonationById,
  getEmergencyDonations,
  updateDonationAmountRaised
} from "../Controllers/DonationController.js";

// Adjust the path as necessary
import fileupload from "../middleware/file-upload.js";

const router = express.Router();

// Create a new group with admin
router.post("/", createDonation);

//get donations
router.get("/", getAllDonations);
router.get("/all", getAllDonationsR);

router.get("/emergency", getEmergencyDonations);

// Get all communities

router.get("/:id", getDonationById);

// Add related posts to a community
router.delete("/:id", deleteDonation);

// Update the admin of a community
router.put("/update/:id", updateDonation);

router.put("/update/amount/:id", updateDonationAmountRaised);


export default router;
