const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // Link to the User (The "Foreign Key" to the Users Table)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Link to the Course (Optional "Foreign Key")
    // If empty, it's a "General Academic" task (e.g. Registration)
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },

    title: {
        type: String,
        required: [true, 'Please add a task title']
    },

    description: {
        type: String,
        default: ''
    },

    // --- PAIN SCORE METRICS ---
    deadline: {
        type: Date,
        required: [true, 'A deadline is required for Pain Score calculation']
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
        min: 1,   // 1% importance
        max: 100, // 100% importance
        default: 10
    },

    // --- STATUS TRACKING ---
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    
    completedAt: {
        type: Date
    }

}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('Task', taskSchema);