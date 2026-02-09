const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });

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
    tasks: [TaskSchema], 
    assignments: [AssignmentSchema], 
}, {
    timestamps: true, 
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
