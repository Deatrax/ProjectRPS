const express = require('express');
const router = express.Router();
const { getCourses, createCourse, deleteCourse, getCourseById } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses)
    .post(protect, createCourse);

router.route('/:id')
    .get(protect, getCourseById)
    .delete(protect, deleteCourse);

module.exports = router;
