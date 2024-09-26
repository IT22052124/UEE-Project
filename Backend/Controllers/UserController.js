import { User } from "../Models/UserModel.js";
import { Community } from "../Models/CommunityModel.js";
import bcrypt from "bcrypt";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, fullName, email, telephone, password, profilePic } =
      req.body;

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const newUser = new User({
      username,
      fullName,
      email,
      telephone,
      profilePic,
      password: hashedPassword, // Store the hashed password
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return the created user (excluding password)
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        fullName: savedUser.fullName,
        email: savedUser.email,
        telephone: savedUser.telephone,
        profilePic: savedUser.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing user by ID
export const updateUser = async (req, res) => {
  try {
    const { username, fullName, email, telephone, password, profilePic } =
      req.body;

    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is provided, encrypt the new password
    let updatedPassword = user.password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: username || user.username,
        fullName: fullName || user.fullName,
        email: email || user.email,
        telephone: telephone || user.telephone,
        profilePic: profilePic || user.profilePic,
        password: updatedPassword, // Updated (hashed) password
      },
      { new: true, runValidators: true }
    );

    // Return the updated user (excluding password)
    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        telephone: updatedUser.telephone,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a Community by ID
// Retrieve all communities a user is part of by user ID
export const getUserCommunities = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "communities.communityId", // Populate the community details
      select: "communityName _id", // Specify the fields to retrieve from Community model
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Communities retrieved successfully",
      communities: user.communities.map((c) => c.communityId), // Return populated community details
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Toggle Join/Unjoin a community by user ID and community ID
export const toggleCommunityMembership = async (req, res) => {
  try {
    const userId = req.params.userId;
    const communityId = req.body.communityId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the user is already a member of the community
    const isMember = user.communities.some(
      (communityObj) => communityObj.communityId.toString() === communityId
    );

    if (isMember) {
      // If the user is a member, unjoin (remove the community)
      user.communities = user.communities.filter(
        (communityObj) => communityObj.communityId.toString() !== communityId
      );
      await user.save();
      return res.status(200).json({
        message: "Successfully left the community",
        communities: user.communities,
      });
    } else {
      // If the user is not a member, join (add the community)
      user.communities.push({ communityId });
      await user.save();
      return res.status(200).json({
        message: "Successfully joined the community",
        communities: user.communities,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
