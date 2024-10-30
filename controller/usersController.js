import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Todo from "../models/todoModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getMissingFieldsPrefix } from "../utils/missingFieldsPrefix.js";

// @desc    Register a user
// @route   POST /api/v1/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, age, email, password } = req.body;

  const missingFields = getMissingFieldsPrefix(req.body);

  if (missingFields) {
    res.status(400);
    throw new Error(`${missingFields} mandatory`);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already registered");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await User.create({
    email,
    name,
    age,
    password: hashedPassword,
  });

  if (user) {
    // Generate access token
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login a user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });

  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate access token
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc    Current user info
// @route   GET /api/v1/users/current
// @access  Private
export const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password") // Exclude the password field
    .populate("Todos");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/delete-user
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
  // Find and delete the user's todos
  await Todo.deleteMany({ owner: req.user.id });

  // Delete the user
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    data: "User and associated todos deleted successfully",
  });
});
