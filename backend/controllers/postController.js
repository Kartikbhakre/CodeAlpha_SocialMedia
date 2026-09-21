const Post = require("../models/Post");
const Comment = require("../models/Comment");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content is required",
      });
    }

    const post = await Post.create({
      content,
      image: image || "",
      author: req.userId,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name username profileImage"
    );

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username profileImage")
      .sort({ createdAt: -1 });

    res.json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can delete only your own post",
      });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LIKE / UNLIKE
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.userId.toString();

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  toggleLike,
};