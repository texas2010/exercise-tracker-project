const mongoose = require('mongoose');

const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    }
})

module.exports = { User }