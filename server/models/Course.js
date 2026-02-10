const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseTitle: {
        type: String,
        required: [true, 'Please add a course title'] // e.g., "Web Programming"
    },
    courseCode: {
        type: String,
        required: [true, 'Please add a course code'] // e.g., "CSE 4540"
    },
    color: {
        type: String,
        default: '#3b82f6' // Default blue if user doesn't pick one
    },
    semester: {
        type: String,
        default: 'Current'
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);