import { Post } from "../Models/PostModel.js"; // Adjust the path as necessary

// Create a new post
export const addPost = async (req, res) => {
  try {
    const { postTitle, descriptions, author, medias } = req.body;

    const newPost = new Post({
      postTitle,
      descriptions,
      author, // Set the author ID
      medias,
    });

    const savedPost = await newPost.save();

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
