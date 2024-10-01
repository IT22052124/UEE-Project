import { Community } from "../Models/CommunityModel.js";
import { Post } from "../Models/PostModel.js"; // Adjust the path as necessary
import { User } from "../Models/UserModel.js";

// Create a new post
export const addPost = async (req, res) => {
  try {
    console.log(req.body);
    // Ensure to access media correctly from the FormData
    const { postTitle, descriptions, author, community, medias } = req.body;

    const newPost = new Post({
      postTitle,
      descriptions,
      author, // Set the author ID
      medias: medias || [], // Ensure medias is an array
    });

    const savedPost = await newPost.save();

    // Check if the community is "Post In Profile"
    if (community === "Post In Profile") {
      // Find the user by ID
      const foundUser = await User.findById(author);

      if (foundUser) {
        // If user is found, push the new post's ID to profilePosts
        foundUser.profilePosts.push(savedPost._id);
        await foundUser.save(); // Save the updated user
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    } else {
      // Find the community by name if not "Post In Profile"
      const foundCommunity = await Community.findOne({
        communityName: community,
      });

      if (foundCommunity) {
        // If community is found, push the new post's ID to relatedPosts
        foundCommunity.relatedPosts.push(savedPost._id);
        await foundCommunity.save(); // Save the updated community

        // Now also update the user's communities with the new post ID
        const foundUser = await User.findById(author);

        if (foundUser) {
          // Check if user is part of the community
          const communityIndex = foundUser.communities.findIndex(
            (c) => c.communityId.toString() === foundCommunity._id.toString()
          );

          if (communityIndex !== -1) {
            // If user is part of the community, push the new post ID to postIds
            foundUser.communities[communityIndex].postIds.push(savedPost._id);
            await foundUser.save(); // Save the updated user
          } else {
            // Optional: handle the case if the user is not part of the community
            // e.g., add the community to user's communities
            foundUser.communities.push({
              communityId: foundCommunity._id,
              postIds: [savedPost._id],
            });
            await foundUser.save(); // Save the updated user
          }
        } else {
          return res.status(404).json({ message: "User not found." });
        }
      } else {
        return res.status(404).json({ message: "Community not found." });
      }
    }

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing post by ID
export const updatePost = async (req, res) => {
  try {
    const { postTitle, descriptions, medias } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        postTitle,
        descriptions,
        medias,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params; // Get post ID from URL parameters
    const { userId, comment } = req.body; // Get user ID and comment from the request body

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId,
      comment,
    });

    await post.save();

    res.status(200).json({
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a reply to a comment
export const addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.params; // Get post ID and comment ID from URL parameters
    const { userId, reply } = req.body; // Get user ID and reply from the request body

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      userId,
      comment: reply,
    });

    await post.save();

    res.status(200).json({
      message: "Reply added successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upvote a post
export const upvotePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from URL parameters
    const userId = req.body.userId; // Get user ID from the request body

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already upvoted
    if (post.upvotedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already upvoted this post" });
    }

    // If user has downvoted, remove them from downvotedBy
    if (post.downvotedBy.includes(userId)) {
      post.downVotes -= 1;
      post.downvotedBy = post.downvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    post.upVotes += 1;
    post.upvotedBy.push(userId);

    await post.save();

    res.status(200).json({
      message: "Post upvoted successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Downvote a post
export const downvotePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from URL parameters
    const userId = req.body.userId; // Get user ID from the request body

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already downvoted
    if (post.downvotedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already downvoted this post" });
    }

    // If user has upvoted, remove them from upvotedBy
    if (post.upvotedBy.includes(userId)) {
      post.upVotes -= 1;
      post.upvotedBy = post.upvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    post.downVotes += 1;
    post.downvotedBy.push(userId);

    await post.save();

    res.status(200).json({
      message: "Post downvoted successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upvote a comment
export const upvoteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params; // Get post ID and comment ID from URL parameters
    const userId = req.body.userId; // Get user ID from the request body

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user has already upvoted the comment
    if (comment.upvotedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already upvoted this comment" });
    }

    // If user has downvoted, remove them from downvotedBy
    if (comment.downvotedBy.includes(userId)) {
      comment.downVotes -= 1;
      comment.downvotedBy = comment.downvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    comment.upVotes += 1;
    comment.upvotedBy.push(userId);

    await post.save();

    res.status(200).json({
      message: "Comment upvoted successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Downvote a comment
export const downvoteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params; // Get post ID and comment ID from URL parameters
    const userId = req.body.userId; // Get user ID from the request body

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user has already downvoted the comment
    if (comment.downvotedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already downvoted this comment" });
    }

    // If user has upvoted, remove them from upvotedBy
    if (comment.upvotedBy.includes(userId)) {
      comment.upVotes -= 1;
      comment.upvotedBy = comment.upvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    comment.downVotes += 1;
    comment.downvotedBy.push(userId);

    await post.save();

    res.status(200).json({
      message: "Comment downvoted successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
