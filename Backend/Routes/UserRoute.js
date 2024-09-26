import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserCommunities,
  toggleCommunityMembership,
} from "../Controllers/UserController.js"; // Import your user controller

const router = express.Router();

// Create a new user
router.post("/users", createUser);

// Update an existing user by ID
router.put("/users/:id", updateUser);

// Delete a user by ID
router.delete("/users/:id", deleteUser);

// Route to retrieve communities for a specific user
router.get("/users/:userId/communities", getUserCommunities);

// Route to toggle membership in a community
router.post("/users/:userId/toggle-community", toggleCommunityMembership);

export default router;
