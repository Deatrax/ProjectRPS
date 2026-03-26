const express = require('express');
const router = express.Router();
const { getUserAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserAchievements);

module.exports = router;
