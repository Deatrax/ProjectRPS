const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true, 
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
