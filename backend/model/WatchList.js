const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const watchListSchema = new Schema({
    watchListId: {
        type: Number,
        require: true
    },
    watchListTitle: {
        type: String,
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
        type: [Number],
        require: false
    },
    ratings: {
        type: [Number],
        require: false
    }
});

const WatchList = model('WatchList', watchListSchema);
module.exports = WatchList;
