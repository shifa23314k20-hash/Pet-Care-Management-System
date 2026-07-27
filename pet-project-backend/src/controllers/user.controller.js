import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { v4 as uuidv4 } from "uuid";

// export const createUser = async (req, res) => {
//   try {
//     const { name, email, password, phone, profileImage, bio, location } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       id: uuidv4(),
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       profileImage,
//       bio,
//       location
//     });
//     const safeUser = await User.findOne({ id: user.id }).select("-password");
//     res.status(201).json({ message: "User created", user: safeUser });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      profileImage,
      bio,
      location,
    } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { id },
      {
        name,
        phone,
        profileImage,
        bio,
        location,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -otp -otpExpiry");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({ id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ id })
      .select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};