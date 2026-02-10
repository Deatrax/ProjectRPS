const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// Get all courses
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ user: req.user.id });
    res.json(courses);
});


const createCourse = asyncHandler(async (req, res) => {
    const { courseTitle, courseCode, color, semester } = req.body;

    // Check if course with this code already exists for the user
    const existingCourse = await Course.findOne({ user: req.user.id, courseCode: courseCode });
    if (existingCourse) {
        return res.status(400).json({ message: 'Course with this code already exists for this user.' });
    }

    const newCourse = new Course({
        courseTitle,
        courseCode,
        color,
        semester,
        user: req.user.id,
    });

    const course = await newCourse.save();
    res.status(201).json(course);
});

// Delete a course
const deleteCourse = asyncHandler(async (req, res) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course removed' });
});

// Get course by ID
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(course);
});

// Get all tasks for a course
const getTasks = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(course.tasks);
});

// Add a task to a course
const addTask = asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const newTask = {
        title,
        description,
        completed: completed || false,
    };

    course.tasks.push(newTask);
    await course.save();

    res.status(201).json(course.tasks[course.tasks.length - 1]);
});

// Update a task in a course
const updateTask = asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const task = course.tasks.id(req.params.taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await course.save();

    res.json(task);
});

// Delete a task from a course
const deleteTask = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const task = course.tasks.id(req.params.taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    task.deleteOne();
    await course.save();

    res.json({ message: 'Task removed' });
});

// Get all assignments for a course
const getAssignments = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(course.assignments);
});

// Add an assignment to a course
const addAssignment = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const newAssignment = {
        title,
        description,
    };

    course.assignments.push(newAssignment);
    await course.save();

    res.status(201).json(course.assignments[course.assignments.length - 1]);
});

// Delete an assignment from a course
const deleteAssignment = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const assignment = course.assignments.id(req.params.assignmentId);

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    assignment.deleteOne();
    await course.save();

    res.json({ message: 'Assignment removed' });
});

module.exports = {
    getCourses,
    createCourse,
    deleteCourse,
    getCourseById,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getAssignments,
    addAssignment,
    deleteAssignment,
};
