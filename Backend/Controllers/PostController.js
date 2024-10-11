import { Community } from "../Models/CommunityModel.js";
import { Comment, Post } from "../Models/PostModel.js"; // Adjust the path as necessary
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
  console.log("Starting addReply function");

  try {
    const { postId, commentId } = req.params; // Get post ID and comment ID from URL parameters
    const { userId, reply } = req.body; // Get user ID and reply from the request body

    // Log the incoming request data
    console.log("Post ID:", postId);
    console.log("Comment ID:", commentId);
    console.log("User ID:", userId);
    console.log("Reply:", reply);
    console.log("Request Body:", req.body); // Log the entire request body for debugging

    // Validate that userId and reply are provided
    if (!userId || !reply) {
      return res
        .status(400)
        .json({ message: "User ID and reply cannot be empty" });
    }

    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Helper function to recursively find the correct comment by its ID
    const findCommentById = (comments, id) => {
      for (let comment of comments) {
        if (comment._id.toString() === id) {
          return comment;
        }
        // Recursively search in nested replies
        if (comment.replies && comment.replies.length > 0) {
          const foundReply = findCommentById(comment.replies, id);
          if (foundReply) {
            return foundReply;
          }
        }
      }
      return null;
    };

    // Find the specific comment by its ID
    const comment = findCommentById(post.comments, commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create a new reply object with proper structure
    const newReply = {
      userId: userId, // Ensure this is the correct user ID
      comment: reply, // Ensure this is the actual reply text
    };

    // Push the new reply into the `replies` array of the found comment
    comment.replies.push(newReply);

    // Log the updated comment to verify structure
    console.log("Updated Comment with Replies:", comment);

    // Save the updated post with the new reply
    await post.save();

    // Respond with success message
    res.status(200).json({
      message: "Reply added successfully",
      post,
    });
  } catch (error) {
    console.log("Error occurred:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Upvote a post
export const upvotePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from URL parameters
    const userId = req.body.userId; // Get user ID from the request body

    console.log(userId);
    console.log(postId);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already upvoted
    if (post.upvotedBy.includes(userId)) {
      post.upVotes -= 1;
      post.upvotedBy = post.upvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      await post.save();

      return res.status(200).json({
        message: "Upvote removed successfully",
        post,
      });
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
    console.log(post);
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
      post.downVotes -= 1;
      post.downvotedBy = post.downvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      await post.save();

      return res.status(200).json({
        message: "Upvote removed successfully",
        post,
      });
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
export const getPostDetailsById = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from URL parameters

    // Find the post by ID and populate the author details, comments, and replies
    const post = await Post.findById(postId)
      .populate("author") // Populate author details
      .populate({
        path: "comments.userId", // Populate user details for comments
        select: "username profilePic", // Select the fields to populate
      })
      .populate({
        path: "comments.replies.userId", // Populate user details for replies
        select: "username profilePic", // Select the fields to populate
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Function to recursively populate replies (if needed)
    const populateNestedReplies = async (comments) => {
      for (const comment of comments) {
        if (comment.replies && comment.replies.length > 0) {
          // Populate the replies' userId
          await Post.populate(comment.replies, {
            path: "userId", // Populate user details for replies
            select: "username profilePic", // Select the fields to populate
          });

          // Recursively call to populate nested replies
          await populateNestedReplies(comment.replies);
        }
      }
    };

    // Start populating replies for the comments
    await populateNestedReplies(post.comments);

    res.status(200).json({
      message: "Post details retrieved successfully",
      post,
    });
  } catch (error) {
    console.error("Error retrieving post details:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPostsFromUserCommunities = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Find all communities where the user is a member and populate relatedPosts and author
    const communities = await Community.find({ members: userId }).populate({
      path: "relatedPosts",
      populate: {
        path: "author", // Assuming 'author' is a field inside the Post model
        select: "username profilePic", // Select the fields you want from the author
      },
    });

    if (!communities || communities.length === 0) {
      return res
        .status(404)
        .json({ message: "No communities found for this user" });
    }

    // Step 2: Collect all related posts from these communities, adding the community name to each post
    const posts = communities.reduce((acc, community) => {
      const communityPostsWithName = community.relatedPosts.map((post) => ({
        ...post.toObject(), // Convert Mongoose document to plain object
        communityName: community.communityName, // Add the community name to each post
        communityPic: community.communityPic,
      }));
      return [...acc, ...communityPostsWithName];
    }, []);

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from URL parameters

    // Find the post by ID and populate the author details, comments, and replies
    const post = await Post.findById(postId)
      .populate("author") // Populate author details
      .populate({
        path: "comments.userId", // Populate user details for comments
        select: "username profilePic", // Select the fields to populate
      })
      .populate({
        path: "comments.replies.userId", // Populate user details for replies
        select: "username profilePic", // Select the fields to populate
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Function to recursively populate replies (if needed)
    const populateNestedReplies = async (comments) => {
      for (const comment of comments) {
        if (comment.replies && comment.replies.length > 0) {
          // Populate the replies' userId
          await Post.populate(comment.replies, {
            path: "userId", // Populate user details for replies
            select: "username profilePic", // Select the fields to populate
          });

          // Recursively call to populate nested replies
          await populateNestedReplies(comment.replies);
        }
      }
    };

    // Start populating replies for the comments
    await populateNestedReplies(post.comments);

    res.status(200).json({
      message: "Post details retrieved successfully",
      Comments: post.comments,
    });
  } catch (error) {
    console.error("Error retrieving post details:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPostsWithoutComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .select("-comments") // Exclude the 'comments' field
      .populate("author", "username profilePic"); // You can populate other fields if necessary

    res.status(200).json({
      message: "Posts retrieved successfully without comments",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
