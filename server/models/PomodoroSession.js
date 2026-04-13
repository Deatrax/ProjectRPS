const mongoose = require('mongoose');

const PomodoroSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    plannedSeconds: {
        type: Number,
        required: true  // How many seconds were originally set
    },
    elapsedSeconds: {
        type: Number,
        default: 0      // How many seconds actually ticked down
    },
    speedMultiplier: {
        type: Number,
        default: 1.0    // 1.0 = normal; 1.1 = 10% faster (penalty)
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'completed', 'abandoned'],
        default: 'active'
    },
    finishedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('PomodoroSession', PomodoroSessionSchema);
