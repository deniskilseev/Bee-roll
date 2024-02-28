const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const WatchList = require('../model/WatchList.js')
const Movie = require('../model/Movie.js')
const User = require('../model/User.js')


const watchListController = {
    async createWatchList(req, res) {
        try {
            const {username, is_public, watch_list_title} = req.body();

            const data_by_username = await User.findOne({login: username});

            if (!data_by_username) {
                return res.status(400).json( {error: "Username does not exist"} );
            }

            if (typeof is_public != "boolean") {
                return res.status(400).json( {error: "isPublic should be a boolean variable"} );
            }

            // Get user id from the request.
            const user_id = data_by_username.uid;

            // Get the value for watchlist id through autoincrement.
            const data_request = await Counter.findOne( {_id: "WatchList"} );
            const counter_value = data_request.collectionCounter;

            // New watchlist entry

            const newWatchList = new WatchList({
                watchListsId: counter_value + 1,
                watchListTitle: watch_list_title,
                isPublic: is_public,
                userId: user_id
            });

            await newWatchList.save(); // Save the new watchlist
            await Counter.findOneAndUpdate( {_id: "WatchList"}, {collectionCounter: counter_value + 1}); // Update the autoincrement

            console.log("WatchList created successfully: ", watch_list_title);

            return res.status(200).json( {message: "Created WatchList successfully"} );
        } catch (error) {
            console.error("Error in createWatchList:", error);
            res.status(500).json( {error: "Internal server error" } );
        }
    }
}
