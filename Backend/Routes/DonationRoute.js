import express from "express";
import {
    createDonation,
    updateDonation,
    deleteDonation,
    getAllDonations,
    getDonationById

} from "../Controllers/DonationController.js";

// Adjust the path as necessary
import fileupload from "../middleware/file-upload.js"

const router = express.Router();

// Create a new group with admin
router.post("/",fileupload.single('image'), createDonation);

//get donations
router.get("/",getAllDonations)

// Get all communities

router.get("/:id", getDonationById);

// Add related posts to a community
router.delete("/:id",deleteDonation)

// Update the admin of a community
router.put("/update/:id", updateDonation);

export default router;
