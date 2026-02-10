const Course = require('../models/Course');
const io = require('../server'); // Import io for real-time updates if needed

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user.id });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
const createCourse = async (req, res) => {
    const { courseTitle, courseCode, color, semester } = req.body;

    if (!courseTitle || !courseCode) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const course = await Course.create({
            user: req.user.id,
            courseTitle,
            courseCode,
            color,
            semester
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    createCourse
};
