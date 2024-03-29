const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const forumSchema = new Schema({
    forumId: {
        type: Number,
        required: true
    },
    forumTitle: {
        type: String,
        required: true
    },
    creatorId: {
        type: Number,
        required: true
    },
    userIds: {
        type: [Number],
        required: true
    },
    moderatorIds: {
        type: [Number],
        required: false
    },
    postIds: {
        type: [Number],
        required: false
    },
    pinnedPost: {
        type: Number,
        required: false
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
});

const Forum = model('Forum', forumSchema);
module.exports = Forum;
