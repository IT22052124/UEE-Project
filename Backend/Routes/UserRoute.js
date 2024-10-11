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
  loginUser,
  getAllUsername,
  resetPassword,
  deleteUserProfilePost,
  toggleFollowUser,
  getFollowingPosts,
} from "../Controllers/UserController.js"; // Import your user controller

const router = express.Router();

// Create a new user
router.post("/signup", createUser);

router.get("/users", getAllUsers);

router.get("/users/username", getAllUsername);

// Update an existing user by ID
router.put("/users/:id", updateUser);

router.post("/reset-password", resetPassword);

router.get("/users/:id", getUserDetailsById);

router.get("/users/:id/profile-posts", getUserProfilePosts);

router.delete("/users/:userId/profile-posts/:postId", deleteUserProfilePost);

// Delete a user by ID
router.delete("/users/:id", deleteUser);

// Route to retrieve communities for a specific user
router.get("/users/:userId/communities", getUserCommunities);

// Route to toggle membership in a community
router.post("/users/:userId/toggle-community", toggleCommunityMembership);

router.post("/login", loginUser);

router.post("/users/:userId/toggle-follow", toggleFollowUser);

router.get("/users/:userId/following-posts", getFollowingPosts);

export default router;
