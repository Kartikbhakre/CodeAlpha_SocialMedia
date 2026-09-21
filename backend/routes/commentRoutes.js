const express = require("express");

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/posts/:id/comments", protect, addComment);

router.get("/posts/:id/comments", protect, getComments);

router.delete(
  "/posts/:postId/comments/:commentId",
  protect,
  deleteComment
);

module.exports = router;