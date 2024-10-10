import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserCommunities,
  toggleCommunityMembership,
  getUserDetailsById,
  getUserProfilePosts,
  getAllUsers,
} from "../Controllers/UserController.js"; // Import your user controller

const router = express.Router();

// Create a new user
router.post("/users", createUser);

router.get("/users", getAllUsers);

// Update an existing user by ID
router.put("/users/:id", updateUser);

router.get("/users/:id", getUserDetailsById);

router.get("/users/:id/profile-posts", getUserProfilePosts);

// Delete a user by ID
router.delete("/users/:id", deleteUser);

// Route to retrieve communities for a specific user
router.get("/users/:userId/communities", getUserCommunities);

// Route to toggle membership in a community
router.post("/users/:userId/toggle-community", toggleCommunityMembership);

export default router;
