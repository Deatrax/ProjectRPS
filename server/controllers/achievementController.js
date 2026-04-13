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
        
        const calculateMaxStreak = (dates) => {
            let max = 0;
            let current = 0;
            if (dates.length > 0) {
                current = 1;
                max = 1;
                for (let i = 1; i < dates.length; i++) {
                    const diffTime = Math.abs(dates[i] - dates[i-1]);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        current++;
                    } else {
                        current = 1;
                    }
                    max = Math.max(max, current);
                }
            }
            return max;
        };

        const maxStreak = calculateMaxStreak(uniqueDates);
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
        const courseMasterProgress = courseMasterUnlocked ? 100 : 0;

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


        // 7. Deadline Acrobat: Submit within last 10 minutes
        const deadlineAcrobatUnlocked = completedTasks.some(t => {
            if (!t.completedAt || !t.deadline) return false;
            const diff = new Date(t.deadline) - new Date(t.completedAt);
            return diff > 0 && diff <= 10 * 60 * 1000; // 10 minutes in ms
        });
        const deadlineAcrobatProgress = deadlineAcrobatUnlocked ? 100 : 0;

        // 8. Sleepless Warrior: Submit between 3 AM – 5 AM
        const sleeplessWarriorUnlocked = completedTasks.some(t => {
            if (!t.completedAt) return false;
            const hour = new Date(t.completedAt).getHours();
            return hour >= 3 && hour < 5;
        });
        const sleeplessWarriorProgress = sleeplessWarriorUnlocked ? 100 : 0;

        // 9. Academic Weapon: Maintain avg difficulty ≥ 4
        const avgDifficulty = tasks.length > 0 
            ? tasks.reduce((acc, t) => acc + t.difficulty, 0) / tasks.length 
            : 0;
        const academicWeaponUnlocked = avgDifficulty >= 4;
        const academicWeaponProgress = Math.min(Math.round((avgDifficulty / 4) * 100), 100);

        // 10. Chaos Manager: Have tasks across 4+ courses
        const courseIds = [...new Set(tasks.filter(t => t.course).map(t => t.course.toString()))];
        const chaosManagerUnlocked = courseIds.length >= 4;
        const chaosManagerProgress = Math.min(Math.round((courseIds.length / 4) * 100), 100);

        // 11. The Disappointment: Miss a deadline
        const missedTasks = tasks.filter(t => {
            if (t.status === 'completed' && t.completedAt && t.deadline) {
                return new Date(t.completedAt) > new Date(t.deadline);
            }
            if (t.status !== 'completed' && t.deadline) {
                return new Date() > new Date(t.deadline);
            }
            return false;
        });
        const theDisappointmentUnlocked = missedTasks.length > 0;
        const theDisappointmentProgress = theDisappointmentUnlocked ? 100 : 0;

        // 12. Overachiever: Add 5 tasks in one day
        const tasksByCreatedDate = {};
        tasks.forEach(t => {
            const date = new Date(t.createdAt).toDateString();
            tasksByCreatedDate[date] = (tasksByCreatedDate[date] || 0) + 1;
        });
        const maxTasksAddedInOneDay = Math.max(0, ...Object.values(tasksByCreatedDate));
        const overachieverUnlocked = maxTasksAddedInOneDay >= 5;
        const overachieverProgress = Math.min(Math.round((maxTasksAddedInOneDay / 5) * 100), 100);

        // 13. Final Boss Approaches: Add a task with ≥40% weight
        const finalBossUnlocked = tasks.some(t => t.weight >= 40);
        const finalBossProgress = finalBossUnlocked ? 100 : 0;

        // 14. Night Owl: Work after midnight 5 times
        const nightOwlSubmissions = completedTasks.filter(t => {
            if (!t.completedAt) return false;
            const hour = new Date(t.completedAt).getHours();
            return hour >= 0 && hour < 3; // Midnight to 3 AM
        }).length;
        const nightOwlUnlocked = nightOwlSubmissions >= 5;
        const nightOwlProgress = Math.min(Math.round((nightOwlSubmissions / 5) * 100), 100);

        // 15. Juggler of Doom: Handle 10+ active tasks
        const activeTasksCount = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
        const jugglerUnlocked = activeTasksCount >= 10;
        const jugglerProgress = Math.min(Math.round((activeTasksCount / 10) * 100), 100);

        // 16. Academic Criminal: Miss a high-weight task
        const academicCriminalUnlocked = tasks.some(t => {
            if (t.weight < 40) return false;
            if (t.status === 'completed' && t.completedAt && t.deadline) {
                return new Date(t.completedAt) > new Date(t.deadline);
            }
            if (t.status !== 'completed' && t.deadline) {
                return new Date() > new Date(t.deadline);
            }
            return false;
        });
        const academicCriminalProgress = academicCriminalUnlocked ? 100 : 0;

        // 17. Consistency King: Complete tasks daily for 5 days
        const fiveDayStreak = calculateMaxStreak(uniqueDates);
        const consistencyKingUnlocked = fiveDayStreak >= 5;
        const consistencyKingProgress = Math.min(Math.round((fiveDayStreak / 5) * 100), 100);

        // 18. Certified Slacker: Miss 3 deadlines
        const certifiedSlackerUnlocked = missedTasks.length >= 3;
        const certifiedSlackerProgress = Math.min(Math.round((missedTasks.length / 3) * 100), 100);

        // 19. Last-Minute Legend: Complete 5 tasks in final hour
        const lastMinuteLegendSubmissions = completedTasks.filter(t => {
            if (!t.completedAt || !t.deadline) return false;
            const diff = new Date(t.deadline) - new Date(t.completedAt);
            return diff > 0 && diff <= 60 * 60 * 1000; // 1 hour
        }).length;
        const lastMinuteLegendUnlocked = lastMinuteLegendSubmissions >= 5;
        const lastMinuteLegendProgress = Math.min(Math.round((lastMinuteLegendSubmissions / 5) * 100), 100);

        // 20. Efficient Being: Complete 3 tasks in one day
        const efficientBeingUnlocked = maxTasksInOneDay >= 3;
        const efficientBeingProgress = Math.min(Math.round((maxTasksInOneDay / 3) * 100), 100);

        // 21. Syllabus Destroyer: Complete all tasks of a course
        const syllabusDestroyerUnlocked = courseMasterUnlocked;
        const syllabusDestroyerProgress = courseMasterProgress;

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
            },
            {
                id: 7,
                title: "Deadline Acrobat",
                description: "Submit within last 10 minutes",
                icon: "Clock",
                unlocked: deadlineAcrobatUnlocked,
                progress: deadlineAcrobatProgress,
                color: "#fb923c",
                points: 150
            },
            {
                id: 8,
                title: "Sleepless Warrior",
                description: "Submit between 3 AM – 5 AM",
                icon: "Moon",
                unlocked: sleeplessWarriorUnlocked,
                progress: sleeplessWarriorProgress,
                color: "#818cf8",
                points: 250
            },
            {
                id: 9,
                title: "Academic Weapon",
                description: "Maintain avg difficulty ≥ 4",
                icon: "Zap",
                unlocked: academicWeaponUnlocked,
                progress: academicWeaponProgress,
                color: "#ef4444",
                points: 200
            },
            {
                id: 10,
                title: "Chaos Manager",
                description: "Have tasks across 4+ courses",
                icon: "Layers",
                unlocked: chaosManagerUnlocked,
                progress: chaosManagerProgress,
                color: "#2dd4bf",
                points: 200
            },
            {
                id: 11,
                title: "The Disappointment",
                description: "Miss a deadline",
                icon: "AlertCircle",
                unlocked: theDisappointmentUnlocked,
                progress: theDisappointmentProgress,
                color: "#6b7280",
                points: 0
            },
            {
                id: 12,
                title: "Overachiever",
                description: "Add 5 tasks in one day",
                icon: "Star",
                unlocked: overachieverUnlocked,
                progress: overachieverProgress,
                color: "#facc15",
                points: 150
            },
            {
                id: 13,
                title: "Final Boss Approaches",
                description: "Add a task with ≥40% weight",
                icon: "Zap",
                unlocked: finalBossUnlocked,
                progress: finalBossProgress,
                color: "#dc2626",
                points: 200
            },
            {
                id: 14,
                title: "Night Owl",
                description: "Work after midnight 5 times",
                icon: "Moon",
                unlocked: nightOwlUnlocked,
                progress: nightOwlProgress,
                color: "#4338ca",
                points: 200
            },
            {
                id: 15,
                title: "Juggler of Doom",
                description: "Handle 10+ active tasks",
                icon: "Layers",
                unlocked: jugglerUnlocked,
                progress: jugglerProgress,
                color: "#7c3aed",
                points: 300
            },
            {
                id: 16,
                title: "Academic Criminal",
                description: "Miss a high-weight task",
                icon: "ShieldAlert",
                unlocked: academicCriminalUnlocked,
                progress: academicCriminalProgress,
                color: "#b91c1c",
                points: 0
            },
            {
                id: 17,
                title: "Consistency King",
                description: "Complete tasks daily for 5 days",
                icon: "Award",
                unlocked: consistencyKingUnlocked,
                progress: consistencyKingProgress,
                color: "#10b981",
                points: 300
            },
            {
                id: 18,
                title: "Certified Slacker",
                description: "Miss 3 deadlines",
                icon: "AlertCircle",
                unlocked: certifiedSlackerUnlocked,
                progress: certifiedSlackerProgress,
                color: "#991b1b",
                points: 0
            },
            {
                id: 19,
                title: "Last-Minute Legend",
                description: "Complete 5 tasks in final hour",
                icon: "Clock",
                unlocked: lastMinuteLegendUnlocked,
                progress: lastMinuteLegendProgress,
                color: "#ea580c",
                points: 400
            },
            {
                id: 20,
                title: "Efficient Being",
                description: "Complete 3 tasks in one day",
                icon: "Zap",
                unlocked: efficientBeingUnlocked,
                progress: efficientBeingProgress,
                color: "#06b6d4",
                points: 150
            },
            {
                id: 21,
                title: "Syllabus Destroyer",
                description: "Complete all tasks of a course",
                icon: "Trophy",
                unlocked: syllabusDestroyerUnlocked,
                progress: syllabusDestroyerProgress,
                color: "#3b82f6",
                points: 300
            }
        ];

        // Stats Calculation
        let totalPoints = completedTasks.length * 10;
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
