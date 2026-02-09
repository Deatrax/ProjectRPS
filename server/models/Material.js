const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Material = mongoose.model('Material', MaterialSchema);

module.exports = Material;
