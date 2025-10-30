import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// ✅ Signup
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const isValidUser = await User.findOne({ email });
    if (isValidUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: "none", // Allow cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful!",
        rest,
      });
  } catch (error) {
    next(error);
  }
};

// ✅ Signout
export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, "User not found"));

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      rest,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, "User not found"));

    if (username) user.username = username;

    if (password) {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      user.password = hashedPassword;
    }

    if (req.file) {
      const profilePhotoUrl = await uploadToCloudinary(req.file);
      user.profilePhoto = profilePhotoUrl;
    }

    await user.save();

    const { password: pass, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      rest,
    });
  } catch (error) {
    next(error);
  }
};
