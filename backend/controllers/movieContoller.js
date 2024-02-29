const mongoose = require('mongoose')
const express = require('express')
const Movie = require('../model/Movie.js')

const movieController = {

    async getMovieInfo(req, res) {
        try {
            const {movie_id} = req.body;
            
            const movie_data = await Movie.findOne( {movieId: movie_id} );

            if (!movie_data) {
                return res.status(400).json( {error: "movie_id does not exist"} );
            }

            return res.status(200).json( {movie_data} );
        } catch (error) {
            console.error("Error in getMovieInfo:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    }
}

module.exports = movieController;
