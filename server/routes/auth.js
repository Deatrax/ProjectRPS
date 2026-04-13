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
      { expiresIn: "1d" }
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
      { expiresIn: "1d" }
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

// ── GET /api/auth/me  Return the current user's profile ─────────────────────
const { protect } = require('../middleware/authMiddleware');
const Task = require('../models/Task');

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/auth/stats  Aggregated task stats for profile ───────────────────
router.get('/stats', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => t.status === 'overdue').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;

    res.json({
      total,
      completed,
      overdue,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUT /api/auth/profile  Update user profile ─────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.email) {
          const emailExists = await User.findOne({ email: req.body.email.toLowerCase().trim() });
          if (emailExists && emailExists._id.toString() !== user._id.toString()) {
              return res.status(400).json({ message: 'Email already in use' });
          }
          user.email = req.body.email.toLowerCase().trim();
      }

      const updatedUser = await user.save();

      // Issue a new token
      const token = jwt.sign(
        { userId: updatedUser._id, name: updatedUser.name },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUT /api/auth/password  Update user password ─────────────────────────────
router.put('/password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
         return res.status(400).json({ message: 'Please provide both current and new password' });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid current password' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
