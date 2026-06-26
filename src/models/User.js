const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    lineUserId: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
    },
    knownName: {
        type: String, // Name the user asked the bot to remember
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
