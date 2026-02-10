const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, date, category, difficulty, materials } = req.body;

    try {
        const newTask = new Task({
            user: req.user.id, // Derived from auth middleware
            title,
            description,
            date,
            category,
            difficulty,
            materials
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
