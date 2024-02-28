const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const chatSchema = new Schema({
    groupId: {
        type: Number,
        required: true
    },
    groupTitle: {
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
    messageIds: {
        type: [Number],
        required: false
    }
});

const Chat = model('Chat', chatSchema);
module.exports = Chat;
