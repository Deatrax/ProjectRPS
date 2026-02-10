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
        required: false // Optional for now to avoid breaking existing tasks, but ideally required
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
