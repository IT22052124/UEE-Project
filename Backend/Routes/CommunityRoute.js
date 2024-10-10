import express from "express";
import {
  addRelatedPosts,
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getAllCommunityByName,
  updateAdmin,
  updateCommunity,
} from "../Controllers/communityController.js";

// Adjust the path as necessary

const router = express.Router();

// Create a new group with admin
router.post("/community", createCommunity);

router.put("/community/:communityId", updateCommunity);

router.delete("/community/:communityId", deleteCommunity);

router.put("/community", updateCommunity);

router.get("/communities", getAllCommunities);

// Get all communities
router.get("/:communityName", getAllCommunityByName);

// Add related posts to a community
router.post("/community/:communityId/relatedPosts", addRelatedPosts);

// Update the admin of a community
router.put("/community/:communityId/admin", updateAdmin);

export default router;
