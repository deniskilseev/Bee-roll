const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageGroupSchema = new Schema({
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
        required: false
    },
    messageIds: {
        type: [Number],
        required: false
    }
});

const MessageGroup = model('MessageGroup', messageGroupSchema);
module.exports = MessageGroup;
