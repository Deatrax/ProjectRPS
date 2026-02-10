const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const debug = true;

// Sign Up Route
router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;

  if (email) email = email.toLowerCase().trim();

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (debug) {
        console.log("DEBUG: User already exists");
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });

    // Save the user in the database
    await user.save();

    // Create JWT token after user is created
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with the token
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error during sign up" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (email) email = email.toLowerCase().trim();

  try {

    if (debug) {
      console.log("DEBUG: Received login request");
      console.log("DEBUG: Login attempt with email:", email);
      console.log("DEBUG: Login attempt with password:", password);
    }
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      if (debug) {
        console.log("DEBUG: User not found");
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      if (debug) {
        console.log("DEBUG: Password does not match");
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with JWT
    res.status(200).json({ token });
    if (debug) {
      console.log("DEBUG: Login successful");
    }
  } catch (error) {
    if (debug) {
      console.log("DEBUG: Server error during login");
    }
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
