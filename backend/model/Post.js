const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    postId: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    postTitle: {
        type: String,
        required: true
    },
    containsSpoilers: {
        type: Boolean,
        required: true,
        default: false
    },
    forumId: {
        type: Number,
        required: true
    },
    postText: {
        type: String,
        required: true
    },
    commentIds: {
        type: [Number],
        required: false
    },
    rating: {
        type: Number,
        default: 0
    },
    isViolating: {
        type: Boolean,
        required: false,
        default: false
    }
});

const Post = model('Post', postSchema);
module.exports = Post;
