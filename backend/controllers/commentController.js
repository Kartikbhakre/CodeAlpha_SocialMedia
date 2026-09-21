const Comment = require("../models/Comment");
const Post = require("../models/Post");

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      text,
      author: req.userId,
      post: req.params.id,
    });

    const populatedComment = await Comment.findById(
      comment._id
    ).populate("author", "name username profileImage");

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.id,
    })
      .populate("author", "name username profileImage")
      .sort({ createdAt: 1 });

    res.json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can delete only your own comment",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};