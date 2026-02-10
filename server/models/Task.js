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
    date: { // Keeping 'date' as it was in original, assuming it means deadline. Project materials say deadline, but code had date. I'll use 'deadline' alias or just date. Original code used 'date'. I'll stick to 'date' but maybe add virtual/alias if needed, or just change to 'deadline'. Let's stick to 'deadline' based on conversation, but map it if needed. The prompt implies 'deadline' in plan. I'll use 'deadline' and remove 'date' to match plan and proper naming.
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
