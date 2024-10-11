import { Community } from "../Models/CommunityModel.js"; // Adjust the path as necessary
import { Post } from "../Models/PostModel.js";
import { User } from "../Models/UserModel.js";

// Create a new community with an admin
export const createCommunity = async (req, res) => {
  try {
    const {
      communityName,
      communityDescription,
      communityPic,
      coverPic,
      adminId,
    } = req.body;

    const existingCommunity = await Community.findOne({ communityName });
    if (existingCommunity) {
      return res
        .status(400)
        .json({ message: "Community name already exists." });
    }

    // Check if the admin user exists
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Create a new community and add the admin as a member
    const newCommunity = new Community({
      communityName,
      communityDescription,
      communityPic,
      coverPic,
      admin: adminId, // Set the admin field
      members: [adminId], // Add the admin as the first member
    });

    // Save the new community to the database
    const savedCommunity = await newCommunity.save();

    // Optionally, you can also update the admin's communities array to include the new community
    await User.findByIdAndUpdate(adminId, {
      $addToSet: { communities: { communityId: savedCommunity._id } },
    });

    // Return the created community
    res.status(201).json({
      message: "Community created successfully",
      community: savedCommunity,
    });
  } catch (error) {
    // Improved error handling
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all communities By ID
export const getAllCommunityByName = async (req, res) => {
  try {
    const community = await Community.find({
      communityName: req.params.communityName,
    })
      .populate("admin", "username fullName profilePic  _id") // Populates admin field with username and email from the User model
      .populate("members", "username fullName profilePic _id") // Populates members with username and email from the User model
      .populate({
        path: "relatedPosts",
        populate: {
          path: "author",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      data: community[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving communities",
      error: error.message,
    });
  }
};

// Add related posts to a community
export const addRelatedPosts = async (req, res) => {
  try {
    const { communityId } = req.params; // Get community ID from URL parameters
    const { postId } = req.body; // Get post IDs from the request body

    // Find the community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "community not found" });
    }

    // Add post IDs to the relatedPosts array
    community.relatedPosts.push(postId);

    // Save the updated community
    await community.save();

    res.status(200).json({
      message: "Related posts added successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the admin of a community
export const updateAdmin = async (req, res) => {
  try {
    const { communityId } = req.params; // Get community ID from URL parameters
    const { adminId } = req.body; // Get new admin ID from the request body

    // Check if the new admin user exists
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "New admin user not found" });
    }

    // Find the community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "community not found" });
    }

    // Update the admin field
    community.admin = adminId;

    // Save the updated community
    await community.save();

    res.status(200).json({
      message: "community admin updated successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCommunities = async (req, res) => {
  try {
    // Fetch all communities from the database and populate necessary fields
    const communities = await Community.find();

    res.status(200).json({
      message: "Communities retrieved successfully",
      communities,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving communities",
      error: error.message,
    });
  }
};

// Update community details
export const updateCommunity = async (req, res) => {
  try {
    const { communityId } = req.params; // Get community ID from URL parameters
    const {
      communityName,
      communityDescription,
      communityPic,
      coverPic,
      adminId,
    } = req.body;

    // Find the community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the community name already exists (if changing the name)
    if (communityName && communityName !== community.communityName) {
      const existingCommunity = await Community.findOne({ communityName });
      if (existingCommunity) {
        return res
          .status(400)
          .json({ message: "Community name already exists." });
      }
      community.communityName = communityName; // Update the name
    }

    // Update other fields
    community.communityDescription =
      communityDescription || community.communityDescription;
    community.communityPic = communityPic || community.communityPic;
    community.coverPic = coverPic || community.coverPic;
    community.admin = adminId || community.admin; // Update the admin field if provided

    // Save the updated community
    const updatedCommunity = await community.save();

    res.status(200).json({
      message: "Community updated successfully",
      community: updatedCommunity,
    });
  } catch (error) {
    // Improved error handling
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete a community
export const deleteCommunity = async (req, res) => {
  try {
    const { communityId } = req.params; // Get community ID from URL parameters

    // Find the community by ID and remove it
    const community = await Community.findByIdAndDelete(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({
      message: "Community deleted successfully",
      communityId: communityId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postDeleteById = async (req, res) => {
  try {
    const { postId, communityId } = req.params;

    // Find and delete the post from the Post collection
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the community to remove the deleted post from relatedPosts
    await Community.findByIdAndUpdate(
      communityId,
      { $pull: { relatedPosts: postId } }, // Remove postId from relatedPosts array
      { new: true }
    );

    res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost, // Return the deleted post information if needed
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: error.message }); // Return a 500 error with the error message
  }
};
