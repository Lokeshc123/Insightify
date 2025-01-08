// This file handles the authentication of the user ... sign up, login, logout, forgot password, reset password

const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const generateToken = require("../services/authService");
const {
  sendEmaiForVerfication,
  sendVerificationSuccessEmail,
} = require("../services/emailService");

// Register a new user

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const verification_code = crypto.randomBytes(4).toString("hex");
    const hashed_verification_code = await bcrypt.hash(verification_code, 10);
    const verification_code_expiry = Date.now() + 15 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password,
      verificationToken: hashed_verification_code,
      verificationTokenExpiry: verification_code_expiry,
    });
    await newUser.save();
    sendEmaiForVerfication(
      newUser.email,
      "Email Verification",
      verification_code
    );
    const jwt_token = generateToken(newUser._id);
    res.cookie("authToken", jwt_token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token: jwt_token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// verify email

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(
      verificationToken,
      user.verificationToken
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.verificationTokenExpiry < Date.now()) {
      return res.status(401).json({ message: "Token expired" });
    }
    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();
    sendVerificationSuccessEmail(user.email);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Login a user

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwt_token = generateToken(user._id);
    res.cookie("authToken", jwt_token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token: jwt_token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, verifyEmail };
