const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    messageId: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    attachments: {
        type: [Buffer],
        required: false
    }
});

const Message = model('Message', messageSchema)
module.exports = Message;
