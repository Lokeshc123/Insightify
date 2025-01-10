const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfile,
} = require("../controllers/authController");
const { verifyToken } = require("../services/authService");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.put("/change-password", changePassword);
router.get("/user-profile", verifyToken, getUserProfile);

module.exports = router;
