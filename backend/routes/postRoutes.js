const express = require("express");

const {
  createPost,
  getPosts,
  deletePost,
  toggleLike,
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPost);

router.get("/", protect, getPosts);

router.delete("/:id", protect, deletePost);

router.put("/:id/like", protect, toggleLike);

module.exports = router;