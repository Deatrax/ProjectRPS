const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const PomodoroSession = require('../models/PomodoroSession');
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: calculate the current speed multiplier for a user
// Multiplier > 1.0 means the timer ticks faster (penalty for procrastination)
// ─────────────────────────────────────────────────────────────────────────────
const calculateMultiplier = async (userId) => {
    const now = new Date();

    // Count overdue incomplete tasks
    const overdueCount = await Task.countDocuments({
        user: userId,
        deadline: { $lt: now },
        status: { $nin: ['completed'] }
    });

    // Count tasks not attempted in the last 7 days (and not completed)
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const untouchedCount = await Task.countDocuments({
        user: userId,
        status: { $nin: ['completed'] },
        $or: [
            { lastAttemptedAt: null },
            { lastAttemptedAt: { $lt: sevenDaysAgo } }
        ]
    });

    // 5% penalty per overdue task, 3% per untouched task, max 1.5x
    const multiplier = Math.min(
        1.5,
        1.0 + (overdueCount * 0.05) + (untouchedCount * 0.03)
    );

    return parseFloat(multiplier.toFixed(2));
};


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/pomodoro/speed-multiplier
// Returns the user's current penalty speed multiplier
// ─────────────────────────────────────────────────────────────────────────────
router.get('/speed-multiplier', protect, async (req, res) => {
    try {
        const multiplier = await calculateMultiplier(req.user.id);
        res.json({ multiplier });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/pomodoro/active-session
// Returns any active session for the current user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/active-session', protect, async (req, res) => {
    try {
        const session = await PomodoroSession.findOne({
            user: req.user.id,
            status: 'active'
        }).populate('task', 'title status pomoDraftSeconds pomoPlannedSeconds');
        res.json({ session });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// POST /api/pomodoro/start
// Start a new Pomodoro session for a specific task
// Body: { taskId, plannedSeconds }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/start', protect, async (req, res) => {
    const { taskId, plannedSeconds } = req.body;

    if (!taskId || !plannedSeconds) {
        return res.status(400).json({ msg: 'taskId and plannedSeconds are required' });
    }

    try {
        // Verify the task belongs to this user
        const task = await Task.findOne({ _id: taskId, user: req.user.id });
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        const multiplier = await calculateMultiplier(req.user.id);

        // Idempotency: check for an existing active session for this user
        // If there's one for the SAME task, return it.
        // If there's one for a DIFFERENT task, we might want to 'abandon' the old one
        // or just return the old one. For now, let's just return any active session if it exists.
        let session = await PomodoroSession.findOne({ user: req.user.id, status: 'active' });

        if (session) {
            // If it's a different task, optionally abandon the old one?
            // For simplicity, let's just create a new one if it's a different task,
            // but update the old one to 'abandoned'
            if (session.task.toString() !== taskId) {
                session.status = 'abandoned';
                session.finishedAt = new Date();
                await session.save();
                session = null; // force new session creation
            } else {
                return res.json({ session, multiplier, msg: 'Resumed existing active session' });
            }
        }

        if (!session) {
            // Create the session
            session = new PomodoroSession({
                user: req.user.id,
                task: taskId,
                plannedSeconds,
                speedMultiplier: multiplier,
                status: 'active'
            });
            await session.save();
        }

        // Stamp lastAttemptedAt on the task (and clear any existing draft)
        // Also save the planned seconds to the task for future draft recovery
        await Task.findByIdAndUpdate(taskId, {
            lastAttemptedAt: new Date(),
            pomoPlannedSeconds: plannedSeconds,
            status: task.status === 'pending' ? 'in-progress' : task.status
        });

        res.json({ session, multiplier });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/pomodoro/:id/save-draft
// User quit mid-session — save the remaining time as a draft
// Body: { remainingSeconds, elapsedSeconds }
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id/save-draft', protect, async (req, res) => {
    const { remainingSeconds, elapsedSeconds } = req.body;

    try {
        const session = await PomodoroSession.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        // Update session to draft status
        session.status = 'draft';
        session.elapsedSeconds = elapsedSeconds || 0;
        session.finishedAt = new Date();
        await session.save();

        // Save draft remaining seconds on the task AND update lastAttemptedAt
        // We also want to keep pomoPlannedSeconds (already saved in /start)
        await Task.findByIdAndUpdate(session.task, {
            pomoDraftSeconds: remainingSeconds,
            // pomoPlannedSeconds: session.plannedSeconds, // redundant but safe
            lastAttemptedAt: new Date()
        });

        res.json({ msg: 'Draft saved', session });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/pomodoro/:id/finish
// Timer ran to 0 (or user declared done)
// Body: { elapsedSeconds, markTaskDone (bool) }
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id/finish', protect, async (req, res) => {
    const { elapsedSeconds, markTaskDone } = req.body;

    try {
        const session = await PomodoroSession.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        // Complete the session
        session.status = 'completed';
        session.elapsedSeconds = elapsedSeconds || session.plannedSeconds;
        session.finishedAt = new Date();
        await session.save();

        // Update the task: clear draft, stamp lastAttemptedAt, optionally complete task
        const taskUpdate = {
            pomoDraftSeconds: null,  // clear draft
            lastAttemptedAt: new Date()
        };
        if (markTaskDone) {
            taskUpdate.status = 'completed';
            taskUpdate.completedAt = new Date();
        }
        const updatedTask = await Task.findByIdAndUpdate(
            session.task,
            taskUpdate,
            { new: true }
        ).populate('course', 'courseTitle courseCode color');

        res.json({ session, task: updatedTask });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/pomodoro/task/:taskId/draft
// Get the current draft remaining seconds for a task (if any)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/task/:taskId/draft', protect, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.taskId,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        res.json({ 
            pomoDraftSeconds: task.pomoDraftSeconds || null,
            pomoPlannedSeconds: task.pomoPlannedSeconds || null
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
