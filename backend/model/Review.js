const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    reviewId: {
        type: Number,
        require: true
    },
    userId: {
        type: Number,
        require: true
    },
    movieId: {
        type: Number,
        require: true
    },
    review: {
        type: Number,
        require: true
    }
});

const Review = model('Review', reviewSchema);
module.exports = Review;
