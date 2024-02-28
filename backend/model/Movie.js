const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const movieSchema = new Schema({
    mid: Number,
    title: String,
    imdbid: Number,
    genres: [String]
});

const Movie = model('movie', movieSchema);
module.exports = Movie;
