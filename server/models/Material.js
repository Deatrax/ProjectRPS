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
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String, // This will store the path/URL to the uploaded file
        required: true
    },
    fileType: {
        type: String,
        default: 'pdf'
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);