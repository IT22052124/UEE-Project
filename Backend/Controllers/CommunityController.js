import { Community } from "../Models/CommunityModel.js"; // Adjust the path as necessary
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

    const newCommunity = new Community({
      communityName,
      communityDescription,
      communityPic,
      coverPic,
      admin: adminId, // Set the admin field
    });

    // Save the new community to the database
    const savedCommunity = await newCommunity.save();

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
      .populate("admin", "username email _id") // Populates admin field with username and email from the User model
      .populate("members", "username email _id") // Populates members with username and email from the User model
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
