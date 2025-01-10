// This file handles the authentication of the user ... sign up, login, logout, forgot password, reset password

const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { sendEmail, emailTemplates } = require("../services/emailService");
const CustomError = require("../utils/customError");
const { generateToken } = require("../services/authService");

// Register a new user

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new CustomError(400, "User already exists"));
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

    sendEmail(
      newUser.email,
      "Email Verification",
      emailTemplates.verificationEmail(verification_code)
    );
    const jwt_token = generateToken(newUser._id);
    if (!jwt_token) {
      return next(new CustomError(500, "Token generation failed"));
    }
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
    return next(error);
  }
};
// verify email

const verifyEmail = async (req, res, next) => {
  const { email, verificationToken } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }
    const isMatch = await bcrypt.compare(
      verificationToken,
      user.verificationToken
    );
    if (!isMatch) {
      return next(new CustomError(401, "Invalid Token"));
    }
    if (user.verificationTokenExpiry < Date.now()) {
      return next(new CustomError(401, "Token expired"));
    }
    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();
    sendEmail(
      user.email,
      "Email verified",
      emailTemplates.verificationSuccessEmail()
    );
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};
// Login a user

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new CustomError(401, "Invalid credentials"));
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
    next(error);
  }
};

// Forgot password

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }
    const resetToken = crypto.randomBytes(4).toString("hex");
    const hashed_reset_token = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    user.resetPasswordToken = hashed_reset_token;
    user.resetPasswordExpire = resetTokenExpiry;

    user.save();

    sendEmail(
      user.email,
      "Password Reset",
      emailTemplates.passwordResetTokenEmail(resetToken)
    );
    res.status(200).json({ message: "Reset password token sent to email" });
  } catch (error) {
    next(error);
  }
};
// reset password with token
const resetPassword = async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }
    if (user.resetPasswordToken === null) {
      return next(new CustomError(401, "No reset password token found"));
    }
    const isMatch = await bcrypt.compare(resetToken, user.resetPasswordToken);
    if (!isMatch) {
      return next(new CustomError(401, "Invalid Token"));
    }
    if (user.resetPasswordExpire < Date.now()) {
      return next(new CustomError(401, "Token expired"));
    }
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    sendEmail(
      user.email,
      "Password Reset Successful",
      emailTemplates.passwordResetSuccessfulEmail()
    );
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
// Change password
const changePassword = async (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new CustomError(401, "Invalid Old Password"));
    }
    user.password = newPassword;
    await user.save();
    sendEmail(
      user.email,
      "Password Changed",
      emailTemplates.passwordChangeSuccessfulEmail()
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
// Get user profile

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordExpire"
    );
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      message: "User profile",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfile,
};
