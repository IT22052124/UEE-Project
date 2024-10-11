import { User } from "../Models/UserModel.js";
import { Community } from "../Models/CommunityModel.js";
import { Post } from "../Models/PostModel.js";
import bcrypt from "bcrypt";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, fullName, email, password, profilePic, telephone } =
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
      telephone: telephone || "", // Optional field
      profilePic: profilePic || "", // Default to an empty string if not provided
      password: hashedPassword, // Store the hashed password
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return the created user (excluding password)
    res.status(200).json({
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
    const { username, fullName, email, profilePic } = req.body;

    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user fields (excluding password)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: username || user.username,
        fullName: fullName || user.fullName,
        email: email || user.email,
        profilePic: profilePic || user.profilePic,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(200).json({ success: false });
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
    // Find the user and populate their communities
    const user = await User.findById(req.params.userId).populate({
      path: "communities.communityId", // Populate the community details
      select: "communityName _id members", // Select the fields to retrieve
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter communities where the user is a member
    const userCommunities = user.communities
      .map((c) => c.communityId)
      .filter(
        (community) => community.members.includes(req.params.userId) // Check if user ID is in the community members list
      );

    res.status(200).json({
      message: "Communities retrieved successfully",
      communities: userCommunities, // Return only the communities where the user is a member
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

    if (!isMember) {
      // If the user is not a member, join (add to user's community list)
      user.communities.push({ communityId });
      await user.save();
    }

    // Now handle community's members list
    const isUserInCommunity = community.members.includes(userId);

    if (isUserInCommunity) {
      // If user is in the community's members list, remove them
      community.members = community.members.filter(
        (memberId) => memberId.toString() !== userId
      );
      await community.save();
      return res.status(200).json({
        message: "Successfully left the community",
        communities: user.communities,
      });
    } else {
      // If the user is not in the community's members list, add them
      community.members.push(userId);
      await community.save();
      return res.status(200).json({
        message: "Successfully joined the community",
        communities: user.communities,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get user details by ID
export const getUserDetailsById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId).select(
      "_id username fullName email telephone profilePic communities followers following"
    ); // Exclude password and select relevant fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details (excluding sensitive information like password)
    res.status(200).json({
      message: "User details retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserProfilePosts = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL params

    // Find the user by ID and populate their profilePosts
    const user = await User.findById(userId).populate({
      path: "profilePosts",
      options: { sort: { createdAt: -1 } }, // Sort by createdAt in descending order
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the populated profilePosts
    res.status(200).json({
      message: "Profile posts retrieved successfully",
      posts: user.profilePosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("-password"); // Exclude password from the results

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsername = async (req, res) => {
  try {
    // Fetch only usernames from the database
    const users = await User.find().select("username");

    res.status(200).json({
      message: "Usernames retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "email not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with the token and user details (excluding password)
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserProfilePost = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    console.log(userId, postId);

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if the post exists in the user's profilePosts
    const postIndex = user.profilePosts.findIndex(
      (post) => post.toString() === postId
    );

    if (postIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found in user profile." });
    }

    // Remove the post ID from the user's profilePosts array
    user.profilePosts.splice(postIndex, 1);
    await user.save();

    // Delete the post from the database
    const postDeleted = await Post.findByIdAndDelete(postId);

    if (!postDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found in database." });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully from user profile and database.",
      postId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    const currentUserId = req.params.userId; // ID of the user performing the action
    const targetUserId = req.body.targetUserId; // ID of the user to follow/unfollow

    // Find the current user and target user
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
    console.log(currentUser, targetUser);
    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is already following the target user
    const isFollowing = currentUser.following.includes(targetUserId);
    console.log(isFollowing);
    if (isFollowing) {
      // If already following, unfollow the user (remove from following and followers arrays)
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );
      await currentUser.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ message: "Successfully unfollowed the user" });
    } else {
      // If not following, follow the user (add to following and followers arrays)
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ message: "Successfully followed the user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.params.userId; // ID of the current user

    // Find the user and populate the following field, and their profilePosts
    const user = await User.findById(userId).populate({
      path: "following", // Populate the following users
      select: "profilePosts", // Only select the profilePosts from those users
      populate: {
        path: "profilePosts", // Populate the profilePosts field in each followed user
        model: "Post", // Populate using the Post model
        options: { sort: { createdAt: -1 } }, // Sort the posts by createdAt in descending order
        populate: {
          path: "author", // Populate the author field in each post
          model: "User", // Populate using the User model
          select: "username profilePic", // Select specific fields from the author
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Collect all the posts from the users that the current user is following
    const followingPosts = user.following.flatMap(
      (followedUser) => followedUser.profilePosts
    );

    res.status(200).json({
      message: "Following posts retrieved successfully",
      posts: followingPosts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving following posts", error });
  }
};
