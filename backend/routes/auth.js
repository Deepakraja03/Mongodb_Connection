// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with the same email already exists." });
    }

    // Create the user
    const user = new User({
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: null, // Initially, there is no last login, so it is set to null
    });

    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});