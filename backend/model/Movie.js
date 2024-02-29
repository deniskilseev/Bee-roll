const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const movieSchema = new Schema({
    movieId: Number,
    title: String,
    genres: [String],
    imdbId: Number
});

const Movie = model('Movie', movieSchema);
module.exports = Movie;
