// This file handles the authentication of the user ... sign up, login, logout, forgot password, reset password

const User = require("../models/UserModel");

const bcrypt = require("bcryptjs");
const generateToken = require("../services/authService");

// Register a new user

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    const jwt_token = generateToken(newUser._id);
    res.cookie("authToken", jwt_token, {
      httpOnly: true, // Prevent client-side access to the cookie

      sameSite: "strict", // Prevent cross-site request forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

module.exports = { register, login };
