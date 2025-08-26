import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendMail.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    console.log("name is :", fullname);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Registered successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
      mess: user.mess || null, // Include selected mess, if exists
    };

    return res.status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",path: "/", })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true
            });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, branch, year, bio } = req.body;
    const userId = req.id; // From middleware

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Upload file if present
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.photoUrl = cloudResponse.secure_url;
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (branch) user.profile.branch = branch;
    if (year) user.profile.year = year;
    if (bio) user.profile.bio = bio;

    await user.save();

    // Now populate mess info
    const updatedUser = await User.findById(user._id).populate("mess");

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required.", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour
    user.resetToken = token;
    user.resetTokenExpire = expireTime;

    await user.save();

    const origin = req.headers.origin || `http://${req.headers.host}`;
    const resetLink = `${origin}/reset-password/${token}`;

    // Send reset email (ensure you have implemented this function)
    await sendResetEmail(email, resetLink);

    return res.status(200).json({
      message: "Reset link sent successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error. Try again later.", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    // console.log("printing the token",newPassword);

    if (!newPassword)
      return res.status(400).json({ message: "New password is required." });
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    // console.log("printing the user ->",user);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};

