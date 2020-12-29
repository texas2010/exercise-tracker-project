const mongoose = require('mongoose');

const Exercise = mongoose.model('Exercise', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 1
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date
    }
})

module.exports = { Exercise };