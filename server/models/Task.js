const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'],
        default: 'General',
        required: true
    },
    // --- PAIN SCORE METRICS ---
    deadline: {
        type: Date,
        required: true
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 5
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        default: 10
    },
    materials: {
        type: String // URL or file path
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
