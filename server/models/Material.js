const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false 
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String, 
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        default: 'pdf'
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);