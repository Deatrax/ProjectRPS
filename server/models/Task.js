const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['lab', 'assign', 'exam'],
        default: 'assign'
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    materials: {
        type: String // URL or file path
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);
