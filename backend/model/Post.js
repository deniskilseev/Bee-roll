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
    forumId: {
        type: Number,
        required: true
    }
});

const Post = model('Post', postSchema);
module.exports = Post;
