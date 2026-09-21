const express = require("express");

const {
  getMe,
  getProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMe);

router.get("/search", protect, searchUsers);

router.put("/profile", protect, updateProfile);

router.get("/:username", protect, getProfile);

router.put("/:id/follow", protect, toggleFollow);

module.exports = router;