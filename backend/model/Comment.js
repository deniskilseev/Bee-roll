const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    commentId: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    postingDate: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;