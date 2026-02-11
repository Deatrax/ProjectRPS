const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .populate('course', 'courseTitle courseCode color')
            .sort({ deadline: 1 }); // Sort by nearest deadline
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, deadline, date, category, difficulty, materials, weight, course } = req.body;

    // Use 'deadline' if present, otherwise 'date' (fallback for teammate's code)
    const taskDeadline = deadline || date;

    try {
        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            deadline: taskDeadline,
            category,
            difficulty,
            weight,
            materials,
            course: course || null
        });

        const task = await newTask.save();
        // Populate course info for the response
        await task.populate('course', 'courseTitle courseCode color');
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
        }).sort({ deadline: 1 }).populate('course', 'courseCode courseTitle color');
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

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { title, description, deadline, category, difficulty, weight, materials, course, status, completed } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (deadline) taskFields.deadline = deadline;
    if (category) taskFields.category = category;
    if (difficulty) taskFields.difficulty = difficulty;
    if (weight) taskFields.weight = weight;
    if (materials) taskFields.materials = materials;
    if (course !== undefined) taskFields.course = course; // allow clearing course
    if (status) taskFields.status = status;

    // Handle 'completed' boolean from frontend toggle
    if (completed !== undefined) {
        taskFields.status = completed ? 'completed' : 'pending';
        if (completed) taskFields.completedAt = Date.now();
        else taskFields.completedAt = null;
    }

    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        ).populate('course', 'courseTitle courseCode color');

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
