const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const WatchList = require('../model/WatchList.js')
const Movie = require('../model/Movie.js')
const User = require('../model/User.js')


const watchListController = {
    async createWatchList(req, res) {
        try {
            const {username, is_public, watchlist_title} = req.body;

            const data_by_username = await User.findOne( {login: username} );

            if (!data_by_username) {
                return res.status(400).json( {error: "Username does not exist"} );
            }

            if (typeof is_public != "boolean") {
                return res.status(400).json( {error: "is_public should be a boolean variable"} );
            }

            // Get user id from the request.
            const user_id = data_by_username.uid;

            const watchlist_data = await WatchList.findOne( {watchListTitle: watchlist_title, userId: user_id} );

            if (watchlist_data) { // If there's already a watchlist with the same name and user, we don't create it.
                return res.status(400).json( {error: "Watchlist already exists"} );
            }

            // Get the value for watchlist id through autoincrement.
            const data_request = await Counter.findOne( {_id: "WatchList"} );
            const counter_value = data_request.collectionCounter;

            // New watchlist entry

            const newWatchList = new WatchList({
                watchListId: counter_value + 1,
                watchListTitle: watchlist_title,
                isPublic: is_public,
                userId: user_id
            });
            
            const newWatchListIds = data_by_username.watchListsIds;

            newWatchListIds.push(counter_value + 1);

            await newWatchList.save(); // Save the new watchlist
            await User.findOneAndUpdate({uid: user_id}, {watchListsIds: newWatchListIds}); // Update the user entry
            await Counter.findOneAndUpdate( {_id: "WatchList"}, {collectionCounter: counter_value + 1}); // Update the autoincrement

            console.log("WatchList created successfully:", watchlist_title);
            const newId =  newWatchListIds[newWatchListIds.length - 1]

            return res.status(201).json( {message: "Created WatchList successfully", newId} );
        } catch (error) {
            console.error("Error in createWatchList:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async getWatchList(req, res) {
        try {
            const {watchlist_id} = req.params;

            const data_by_id = await WatchList.findOne( {watchListId: watchlist_id} );

            if (!data_by_id) {
                return res.status(400).json( {error: "watchlist_id does not exist"} );
            }

            return res.status(200).json({data_by_id});

        } catch (error) {
            console.error("Error in getWatchList:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async addMovie(req, res) {
        try {
            const {watchlist_id, movie_id, rating} = req.body;

            const data_by_id = await WatchList.findOne( {watchListId: watchlist_id} );
        
            if (!data_by_id) {
                return res.status(400).json( {error: "watchlist_id does not exist"} );
            }

            // check whether movie ids are valid.
            const movie_data = await Movie.findOne( {movieId: movie_id} );

            if(!movie_data) {
                return res.status(400).json( {error: "movie_id does not exist"} );
            }

            if (rating > 5 || rating < 0) {
                return res.status(400).json( {error: "invalid rating"} );
            }
            
            const movie_ids = data_by_id.movieIds;
            const existing_ratings = data_by_id.ratings;

            const index = movie_ids.indexOf(movie_id);

            if (index == -1) { // The index does not exist
                movie_ids.push(movie_id);
                existing_ratings.push(rating);
            } else {
                existing_ratings[index] = rating;
            }
            
            // Modify the entry in the DataBase:
            
            await WatchList.findOneAndUpdate( {watchListId: watchlist_id}, {movieIds: movie_ids, ratings: existing_ratings} );

            return res.status(200).json( {message: "Modified watchlist successfully"} );

        } catch (error) {
            console.error("Error in addMovie:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },
    
    async removeMovie(req, res) {
        try {
            const {watchlist_id, movie_id} = req.body;

            const data_by_watchlist_id = await WatchList.findOne( {watchListId: watchlist_id} );

            if (!data_by_watchlist_id) {
                return res.status(400).json( {error: "watchlist_id does not exist"} );
            }

            const data_by_movie_id = await Movie.findOne( {movieId: movie_id} );

            if (!data_by_movie_id) {
                return res.status(400).json( {error: "movie_id does not exist"} );
            }

            const movie_ids = data_by_watchlist_id.movieIds;
            const existing_ratings = data_by_watchlist_id.ratings;

            const index = movie_ids.indexOf(movie_id);

            if (index != -1) { // Movie exists
                movie_ids.splice(index, 1);
                existing_ratings.splice(index, 1);
            }
           
            // Modify the entry in the DataBase

            await WatchList.findOneAndUpdate( {watchListId: watchlist_id}, {movieIds: movie_ids, ratings: existing_ratings });

            return res.status(200).json( {message: "Modified watchlist successfully"} );

        } catch (error) {
            console.error("Error in removeMovie:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async predictMovies(req, res) {
        try {
            const {watchlist_id} = req.params;
            // TODO: Add the Machine Learning server. And send http request.
            res.status(404).json( {message: "Not Found"} );
        } catch (error) {
            console.error("Error in predictMovies:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async deleteWatchList(req, res) {
        try {
            const {watchlist_id} = req.params;

            const watchlist_data = await WatchList.findOne( {watchListId: watchlist_id} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlist_id does not exist"} );
            }
            const user_id = watchlist_data.userId;

            const user_data = await User.findOne( {uid: user_id} );

            if (!user_data) {
                return res.status(400).json( {error: "the owner has been deleted"} );
            }
            
            const watchlist_ids = user_data.watchListsIds;
            const index = watchlist_ids.indexOf(watchlist_id);

            if (index != -1) {
                watchlist_ids.splice(index, 1);
            }
        
            await WatchList.deleteOne( {watchListId: watchlist_id} ); // Delete watchlist
            await User.findOneAndUpdate( {uid: user_id}, {watchListsIds: watchlist_ids} ); // Update User entry

            res.status(200).json( {message: "Deleted the watchlist successfully"} );
        } catch (error) {
            console.error("Error in predictMovies:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    }
}

module.exports = watchListController;
