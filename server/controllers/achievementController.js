const Task = require('../models/Task');
const Course = require('../models/Course');

// @desc    Get user achievements
// @route   GET /api/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all user tasks and courses
        const tasks = await Task.find({ user: userId });
        const courses = await Course.find({ user: userId });

        const completedTasks = tasks.filter(t => t.status === 'completed');
        
        // 1. First Step: Complete your first task
        const firstStepUnlocked = completedTasks.length > 0;
        const firstStepProgress = firstStepUnlocked ? 100 : 0;

        // 2. Early Bird: Complete a task before its deadline
        const earlyBirdUnlocked = completedTasks.some(t => {
            if (!t.completedAt || !t.deadline) return false;
            return new Date(t.completedAt) < new Date(t.deadline);
        });
        const earlyBirdProgress = earlyBirdUnlocked ? 100 : 0;

        // 3. On Fire: Maintain a 3-day streak
        const completionDates = completedTasks
            .filter(t => t.completedAt)
            .map(t => new Date(t.completedAt).toDateString());
        
        const uniqueDates = [...new Set(completionDates)].map(d => new Date(d)).sort((a, b) => a - b);
        
        let maxStreak = 0;
        let currentStreak = 0;
        if (uniqueDates.length > 0) {
            currentStreak = 1;
            maxStreak = 1;
            for (let i = 1; i < uniqueDates.length; i++) {
                const diffTime = Math.abs(uniqueDates[i] - uniqueDates[i-1]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
                maxStreak = Math.max(maxStreak, currentStreak);
            }
        }
        const onFireUnlocked = maxStreak >= 3;
        const onFireProgress = Math.min(Math.round((maxStreak / 3) * 100), 100);

        // 4. Course Master: Complete all tasks in a course
        let courseMasterUnlocked = false;
        if (courses.length > 0) {
            for (const course of courses) {
                const tasksForCourse = tasks.filter(t => t.course && t.course.toString() === course._id.toString());
                if (tasksForCourse.length > 0 && tasksForCourse.every(t => t.status === 'completed')) {
                    courseMasterUnlocked = true;
                    break;
                }
            }
        }
        const courseMasterProgress = courseMasterUnlocked ? 100 : 0; // Simplified for now

        // 5. Scholar: Add 5 courses to your dashboard
        const scholarUnlocked = courses.length >= 5;
        const scholarProgress = Math.min(Math.round((courses.length / 5) * 100), 100);

        // 6. Procrastination Slayer: Complete 10 tasks in one day
        const tasksByDate = {};
        completionDates.forEach(date => {
            tasksByDate[date] = (tasksByDate[date] || 0) + 1;
        });
        const maxTasksInOneDay = Math.max(0, ...Object.values(tasksByDate));
        const procrastinationSlayerUnlocked = maxTasksInOneDay >= 10;
        const procrastinationSlayerProgress = Math.min(Math.round((maxTasksInOneDay / 10) * 100), 100);

        // Achievement Points Mapping
        const achievementsList = [
            {
                id: 1,
                title: "First Step",
                description: "Complete your first task",
                icon: "Target",
                unlocked: firstStepUnlocked,
                progress: firstStepProgress,
                color: "#4ade80",
                points: 100
            },
            {
                id: 2,
                title: "Early Bird",
                description: "Complete a task before its deadline",
                icon: "Zap",
                unlocked: earlyBirdUnlocked,
                progress: earlyBirdProgress,
                color: "#fbbf24",
                points: 100
            },
            {
                id: 3,
                title: "On Fire",
                description: "Maintain a 3-day streak",
                icon: "Flame",
                unlocked: onFireUnlocked,
                progress: onFireProgress,
                color: "#f87171",
                points: 200
            },
            {
                id: 4,
                title: "Course Master",
                description: "Complete all tasks in a course",
                icon: "Trophy",
                unlocked: courseMasterUnlocked,
                progress: courseMasterProgress,
                color: "#60a5fa",
                points: 300
            },
            {
                id: 5,
                title: "Scholar",
                description: "Add 5 courses to your dashboard",
                icon: "Shield",
                unlocked: scholarUnlocked,
                progress: scholarProgress,
                color: "#a78bfa",
                points: 150
            },
            {
                id: 6,
                title: "Procrastination Slayer",
                description: "Complete 10 tasks in one day",
                icon: "Crown",
                unlocked: procrastinationSlayerUnlocked,
                progress: procrastinationSlayerProgress,
                color: "#f472b6",
                points: 500
            }
        ];

        // Stats Calculation
        let totalPoints = completedTasks.length * 10; // 10 points per task
        achievementsList.forEach(a => {
            if (a.unlocked) totalPoints += a.points;
        });

        const unlockedCount = achievementsList.filter(a => a.unlocked).length;

        // Rank Calculation
        let rank = "Novice Scholar";
        if (totalPoints > 3000) rank = "Grandmaster Scholar";
        else if (totalPoints > 1500) rank = "Master Scholar";
        else if (totalPoints > 750) rank = "Advanced Scholar";
        else if (totalPoints > 250) rank = "Apprentice Scholar";

        res.json({
            achievements: achievementsList,
            stats: {
                totalPoints,
                unlockedCount,
                totalCount: achievementsList.length,
                rank
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching achievements" });
    }
};

module.exports = {
    getUserAchievements
};
