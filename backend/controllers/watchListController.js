const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const WatchList = require('../model/WatchList.js')
const Movie = require('../model/Movie.js')
const User = require('../model/User.js')


const watchListController = {
    async createWatchList(req, res) {
        try {
            const {isPublic, watchlistTitle} = req.body;

            const user_data = await User.findOne( {login: req.user.login} );

            if (!user_data) {
                return res.status(400).json( {error: "Username does not exist"} );
            }

            if (typeof isPublic != "boolean") {
                return res.status(400).json( {error: "is_public should be a boolean variable"} );
            }

            // Get user id from the request.
            const userId = user_data.uid;

            const watchlist_data = await WatchList.findOne( {watchListTitle: watchlistTitle, userId: userId} );

            if (watchlist_data) { // If there's already a watchlist with the same name and user, we don't create it.
                return res.status(400).json( {error: "Watchlist already exists"} );
            }

            // Get the value for watchlist id through autoincrement.
            const data_request = await Counter.findOne( {_id: "WatchList"} );
            const counter_value = data_request.collectionCounter;

            // New watchlist entry

            const newWatchList = new WatchList({
                watchListId: counter_value + 1,
                watchListTitle: watchlistTitle,
                isPublic: isPublic,
                userId: userId
            });
            
            const newWatchListIds = user_data.watchListsIds;

            newWatchListIds.push(counter_value + 1);

            await newWatchList.save(); // Save the new watchlist
            await User.findOneAndUpdate({uid: userId}, {watchListsIds: newWatchListIds}); // Update the user entry
            await Counter.findOneAndUpdate( {_id: "WatchList"}, {collectionCounter: counter_value + 1}); // Update the autoincrement

            console.log("WatchList created successfully:", watchlistTitle);

            return res.status(201).json( {message: "Created WatchList successfully"} );
        } catch (error) {
            console.error("Error in createWatchList:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async getWatchList(req, res) {
        try {
            const {watchlistId} = req.params;

            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }
            
            if (watchlist_data.isPublic) {
                return res.status(200).json({watchlist_data});
            }

            const user_data = await User.findOne( {login: req.user.login} );

            if (user_data.uid == watchlist_data.userId || watchlist_data.followerIds.includes(user_data.uid)) {
                return res.status(200).json({watchlist_data});
            }

            return res.status(403).json({error: "Unauthorized"});

        } catch (error) {
            console.error("Error in getWatchList:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async addMovie(req, res) {
        try {
            const {watchlistId, movieId} = req.body;

            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );
        
            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }

            // check whether movie ids are valid.
            const movie_data = await Movie.findOne( {movieId: movieId} );

            if(!movie_data) {
                return res.status(400).json( {error: "movieId does not exist"} );
            }

            const user_data = await User.findOne( {login: req.user.login} );

            if (user_data.uid == watchlist_data.userId) {

                const movie_ids = watchlist_data.movieIds;

                const index = movie_ids.indexOf(movieId);

                if (index == -1) { // The index does not exist
                    movie_ids.push(movieId);
                }
            
                // Modify the entry in the DataBase:
            
                await WatchList.findOneAndUpdate( {watchListId: watchlistId}, {movieIds: movie_ids} );

                return res.status(200).json( {message: "Modified watchlist successfully"} );
            }

            return res.status(403).json( {error: "Unauthorized"} );

        } catch (error) {
            console.error("Error in addMovie:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },
    
    async removeMovie(req, res) {
        try {
            const {watchlistId, movieId} = req.body;

            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }

            const movie_data = await Movie.findOne( {movieId: movieId} );

            if (!movie_data) {
                return res.status(400).json( {error: "movieId does not exist"} );
            }

            const user_data = await User.findOne( {login: req.user.login} );

            if (user_data.uid == watchlist_data.userId) {
                const movie_ids = watchlist_data.movieIds;

                const index = movie_ids.indexOf(movieId);

                if (index != -1) { // Movie exists
                    movie_ids.splice(index, 1);
                }
           
                // Modify the entry in the DataBase

                await WatchList.findOneAndUpdate( {watchListId: watchlistId}, {movieIds: movie_ids });

                return res.status(200).json( {message: "Modified watchlist successfully"} );
            }

            return res.status(403).json( {error: "Unauthorized"} );

        } catch (error) {
            console.error("Error in removeMovie:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async deleteWatchList(req, res) {
        try {
            const {watchlistId} = req.params;

            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }
            
            const user_data = await User.findOne( {login: req.user.login} );

            if (!user_data) {
                return res.status(400).json( {error: "the owner has been deleted"} );
            }

            if (watchlist_data.userId == user_data.uid) {
                const watchlist_ids = user_data.watchListsIds;
                const index = watchlist_ids.indexOf(watchlistId);
                const userId = user_data.uid

                if (index != -1) {
                    watchlist_ids.splice(index, 1);
                }

                // For each follower, we delete the watchlist from their array
                
                for (follower of watchlist_data.followerIds) {
                    let follower_data = User.findOne({uid: follower});
                    let followedWatchListsIds = follower_data.followedWatchListsIds;
                    let follower_index = followedWatchListsIds.indexOf(watchlistId);
                    if (follower_index != -1) {
                        followedWatchListsIds.splice(follower_index, 1);
                    }
                    await User.findOneAndUpdate({uid: follower}, { followedWatchListsIds: followedWatchListsIds} );
                }

                await WatchList.deleteOne( {watchListId: watchlistId} ); // Delete watchlist
                await User.findOneAndUpdate( {uid: userId}, {watchListsIds: watchlist_ids} ); // Update User entry

                return res.status(200).json( {message: "Deleted the watchlist successfully"} );
            }

            return res.status(403).json( {error: "Unauthorized" });
        } catch (error) {
            console.error("Error in deleteWatchList:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async togglePublic(req, res) {
        try {
            const {watchlistId} = req.body;

            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }
            
            const user_data = await User.findOne( {login: req.user.login} );

            if (!user_data) {
                return res.status(400).json( {error: "the owner has been deleted"} );
            }

            if (watchlist_data.userId == user_data.uid) {
                const newPublic = !watchlist_data.isPublic;
                await WatchList.findOneAndUpdate({watchListId: watchlistId}, {isPublic: newPublic}); // Update private

                return res.status(200).json( {message: "OK"} );
            }
            
            return res.status(403).json( {error: "Unauthorized"} );
        } catch(error) {
            console.error("Error in togglePublic:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },
    
    async followWatchlist(req, res) {
        try {
            const {watchlistId} = req.body;
            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }

            const user_data = await User.findOne( {login: req.user.login} );

            if (!user_data) {
                return res.status(400).json( {error: "no user with such username"} );
            }

            if (watchlist_data.isPublic && user_data.uid != watchlist_data.userId) {
                const followerId = user_data.uid;
                const followerIds = watchlist_data.followerIds;
                const watchlist_index = followerIds.indexOf(followerId);

                if (watchlist_index == -1) { // Push the follower
                    followerIds.push(followerId);
                }

                const followedWatchListsIds = user_data.followedWatchListsIds;
                const user_index = followedWatchListsIds.indexOf(watchlistId);

                if (user_index == -1) { // Push the watchlist
                    followedWatchListsIds.push(watchlistId);
                }

                await WatchList.findOneAndUpdate( {watchListId: watchlistId}, {followerIds: followerIds});
                await User.findOneAndUpdate( {login: req.user.login}, {followedWatchListsIds: followedWatchListsIds});
                
                return res.status(200).json( {message: "OK"} );
            }

            return res.status(403).json( {error: "Unauthorized"} );
        } catch (error) {
            console.error("Error in followWatchlist:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async unfollowWatchlist(req, res) {
        try {
            const {watchlistId} = req.body;
            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "watchlistId does not exist"} );
            }

            const user_data = await User.findOne( {login: req.user.login} );

            if (!user_data) {
                return res.status(400).json( {error: "no user with such username"} );
            }

            if (user_data.uid != watchlist_data.userId) {
                const followerId = user_data.uid;
                const followerIds = watchlist_data.followerIds;
                const watchlist_index = followerIds.indexOf(followerId);

                if (watchlist_index != -1) { // Push the follower
                    followerIds.splice(watchlist_index, 1);
                }

                const followedWatchListsIds = user_data.followedWatchListsIds;
                const user_index = followedWatchListsIds.indexOf(watchlistId);

                if (user_index != -1) { // Push the watchlist
                    followedWatchListsIds.splice(user_index, 1);
                }

                await WatchList.findOneAndUpdate( {watchListId: watchlistId}, {followerIds: followerIds});
                await User.findOneAndUpdate( {login: req.user.login}, {followedWatchListsIds: followedWatchListsIds});
                
                return res.status(200).json( {message: "OK"} );
            }

            return res.status(400).json( {error: "The creator cannot unfollow the Watchlist"} );

        } catch (error) {
            console.error("Error in unfollowWatchlist:");
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async changeWatchListName(req, res) {
        try {
            const {watchlistId, newTitle} = req.body;
            const login = req.user.login;

            const user_data = await User.findOne( {login: login} );

            const watchlist_data = await WatchList.findOne( {watchListId: watchlistId} );

            if (!watchlist_data) {
                return res.status(400).json( {error: "Invalid watchlistId"} );
            }
            
            if (!newTitle || typeof newTitle !== "string") {
                return res.status(400).json( {error: "Invalid title"} );
            }
           
            if (user_data.uid === watchlist_data.userId) {
                await WatchList.findOneAndUpdate({watchListId: watchlistId}, {watchListTitle: newTitle});
                return res.status(200).json( {message: "OK"} );
            }

            return res.status(403).json( {error: "Unauthorized"} );
        
        } catch (error) {
            console.error("Error in changeWatchListName:", error);
            res.status(500).json( {error: "Internal error" });
        }
    }
}

module.exports = watchListController;
