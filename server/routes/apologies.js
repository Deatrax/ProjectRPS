const express = require('express');
const router = express.Router();
const ApologyLetter = require('../models/ApologyLetter');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/apologies   Save a new apology letter
router.post('/', protect, async (req, res) => {
    const { text, overdueTasks } = req.body;
    if (!text || text.trim().split(/\s+/).filter(Boolean).length < 50) {
        return res.status(400).json({ msg: 'Letter must be at least 50 words.' });
    }
    try {
        const letter = await ApologyLetter.create({
            user: req.user.id,
            text: text.trim(),
            overdueTasks: overdueTasks || []
        });
        res.status(201).json(letter);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/apologies   Get all letters for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const letters = await ApologyLetter.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(letters);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
