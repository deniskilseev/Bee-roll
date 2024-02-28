const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const watchListSchema = new Schema({
    watchListsId: {
        type: Number,
        require: true
    },
    isPublic: {
        type: Boolean,
        require: true
    },
    userId: {
        type: Number,
        require: true
    },
    movieIds: {
        type: [String],
        require: false
    },
    ratings: {
        type: [Number],
        require: false
    }
});

const WatchList = model('WatchList', watchListSchema);
module.exports = WatchList;
