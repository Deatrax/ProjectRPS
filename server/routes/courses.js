const express = require('express');
const router = express.Router();
const { getCourses, createCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCourses).post(protect, createCourse);

module.exports = router;
