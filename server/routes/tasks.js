const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, date, category, difficulty, materials, course, weigth } = req.body;

    try {
        const newTask = new Task({
            user: req.user.id,
            course,
            title,
            description,
            date,
            category,
            difficulty,
            materials,
            weight: req.body.weight // Make sure weight is saved
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/course/:courseId
// @desc    Get all tasks for a specific course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
            course: req.params.courseId
        }).sort({ date: 1 }).populate('course', 'courseCode courseTitle color');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('course', 'courseCode courseTitle color');

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Check user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
