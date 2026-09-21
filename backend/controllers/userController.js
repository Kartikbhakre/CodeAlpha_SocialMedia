const User = require("../models/User");
const Post = require("../models/Post");

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("followers", "name username profileImage")
      .populate("following", "name username profileImage");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PROFILE BY USERNAME
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    })
      .select("-password")
      .populate("followers", "name username profileImage")
      .populate("following", "name username profileImage");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await Post.find({
      author: user._id,
    })
      .populate("author", "name username profileImage")
      .sort({ createdAt: -1 });

    res.json({
      user,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE OWN PROFILE
const updateProfile = async (req, res) => {
  try {
    const { name, bio, profileImage } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FOLLOW / UNFOLLOW
const toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const targetId = targetUser._id.toString();

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === targetId
    );

    if (alreadyFollowing) {
      // UNFOLLOW
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetId
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
    } else {
      // FOLLOW
      currentUser.following.push(targetUser._id);

      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: alreadyFollowing ? "Unfollowed successfully" : "Followed successfully",
      following: !alreadyFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH USERS
const searchUsers = async (req, res) => {
  try {
    const q = req.query.q || "";

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(10);

    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMe,
  getProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
};