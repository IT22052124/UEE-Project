import express from "express";
import {
  addPost,
  updatePost,
  addComment,
  addReply,
  upvotePost,
  downvotePost,
  upvoteComment,
  downvoteComment,
  getPostDetailsById,
  getPostsFromUserCommunities,
  getPostComments,
  getPostsWithoutComments,
} from "../Controllers/PostController.js"; // Adjust the path as necessary

const router = express.Router();

// Add a new post
router.post("/posts", addPost);

// Update an existing post by ID
router.put("/posts/:id", updatePost);

router.get("/posts/:id", getPostDetailsById);

// Add a comment to a post
router.post("/posts/:postId/comments", addComment);

// Add a reply to a comment
router.post("/posts/:postId/comments/:commentId/replies", addReply);

// Upvote a post
router.put("/posts/:id/upvote", upvotePost);

// Downvote a post
router.put("/posts/:id/downvote", downvotePost);

// Upvote a comment
router.put("/posts/:postId/comments/:commentId/upvote", upvoteComment);

// Downvote a comment
router.put("/posts/:postId/comments/:commentId/downvote", downvoteComment);

router.get("/user/:userId/communities/posts", getPostsFromUserCommunities);

router.get("/posts/:id/comments", getPostComments);

// Route for getting posts without comments
router.get("/posts/:postId/nocomments", getPostsWithoutComments);

export default router;
