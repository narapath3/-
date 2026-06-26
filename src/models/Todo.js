const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    lineUserId: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Todo', todoSchema);
