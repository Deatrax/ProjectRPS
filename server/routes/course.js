const express = require('express');
const router = express.Router();
const { 
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
    deleteAssignment
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses)
    .post(protect, createCourse);

router.route('/:id')
    .get(protect, getCourseById)
    .delete(protect, deleteCourse);

// Task routes
router.route('/:id/tasks')
    .get(protect, getTasks)
    .post(protect, addTask);

router.route('/:id/tasks/:taskId')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

// Assignment routes
router.route('/:id/assignments')
    .get(protect, getAssignments)
    .post(protect, addAssignment);

router.route('/:id/assignments/:assignmentId')
    .delete(protect, deleteAssignment);

module.exports = router;
