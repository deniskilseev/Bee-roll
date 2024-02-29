const mongoose = require('mongoose')
const express = require('express')
const Movie = require('../model/Movie.js')

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}


const movieController = {

    async getMovieInfo(req, res) {
        try {
            const {movie_id} = req.params;
            
            const movie_data = await Movie.findOne( {movieId: movie_id} );

            if (!movie_data) {
                return res.status(400).json( {error: "movie_id does not exist"} );
            }

            return res.status(200).json( {movie_data} );
        } catch (error) {
            console.error("Error in getMovieInfo:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async findMoviesWithPattern(req, res) {
        try {
            const {pattern} = req.params;

            const regex = new RegExp(escapeRegExp(pattern), "gi");

            const foundMovies = await Movie.find( {title: regex} );

            return res.status(200).json( {foundMovies} );
        } catch (error) {
            console.error("Error in findMoviesWithPattern:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    }
}

module.exports = movieController;
