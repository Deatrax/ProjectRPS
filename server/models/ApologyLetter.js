const mongoose = require('mongoose');

const ApologyLetterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    overdueTasks: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('ApologyLetter', ApologyLetterSchema);
