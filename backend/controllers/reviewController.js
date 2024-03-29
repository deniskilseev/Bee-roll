const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const Movie = require('../model/Movie.js')
const User = require('../model/User.js')
const Review = require('../model/Review.js')
const predictController = require('./predictController')


const reviewController = {
    async createReview(req, res) {
        try {
           const {user_id, movie_id, review} = req.body;
            
            const user_data = await User.findOne( {uid: user_id} );

            if (!user_data) {
                return res.status(400).json( {error: "User does not exist"} );
            }

            const movie_data = await Movie.findOne( {movieId: movie_id} );
            
            if (!movie_data) {
                return res.status(400).json( {error: "Movie does not exist"} );
            }

            if ((review > 5 || review < 0) && review) {
                return res.status(400).json( {error: "Review should be between 0 and 5"} );
            }

            const data_request = await Counter.findOne( {_id: "Review"} );
            const counter_value = data_request.collectionCounter;

            const newReview = new Review({
                reviewId: counter_value + 1,
                userId: user_id,
                movieId: movie_id,
                review: review,
            });

            const newReviewIds = user_data.reviewIds;

            newReviewIds.push(counter_value + 1);

            await newReview.save()
            await User.findOneAndUpdate({uid: user_id}, {reviewIds: newReviewIds}); // Update the user entry
            await Counter.findOneAndUpdate({_id: "Review"}, {collectionCounter: counter_value + 1})
            
            console.log("Review created successfully");

            await predictController.updateUser(user_id);

            return res.status(201).json( {message: "Created Review successfully"} );

        } catch (error) {
            console.error("Error in createReview:", error);
            return res.status(500).json( {error: "internal server error"} );
        }
    },

    async getReviews(req, res) {
        try {
            const {user_id} = req.params;
            
            const user_data = await User.findOne( {uid: user_id} );

            if (!user_data) {
                return res.status(400).json( {error: "User does not exist"} );
            }

            const review_data = await Review.find( {userId: user_id} );

            return res.status(200).json( {reviews: review_data} );

        } catch (error) {
            console.error("Error in getReviews:", error);
            return res.status(500).json( {error: "internal server error"} );
        }
    }, 

    async updateReview(req, res) {
        try {
            const {review_id, review} = req.body;
            
            const review_data = await Review.findOne( {reviewId: review_id} );

            if (!review_data) {
                return res.status(400).json( {error: "Review does not exist"} );
            }

            if (rating < 0 || rating > 5) {
                return res.status(400).json( {error: "Review should be between 0 and 5"} );
            }

            await Review.findOneAndUpdate({reviewId: review_id}, {review: review});

            await predictController.updateUser(user_id);

            return res.status(200).json( {reviews: review_data} );

        } catch (error) {
            console.error("Error in updateReview:", error);
            return res.status(500).json( {error: "internal server error"} );
        }
    },

    async deleteReview(req, res) {
        try {
            const {review_id} = req.params;

            const review_data = await Review.findOne( {reviewId: review_id });

            if (!review_data) {
                return res.status(400).json( {error: "Review does not exist"} );
            }

            const user_id = review_data.userId
            const user_data = await User.findOne( {uid: user_id} );

            if (!user_data) {
                return res.status(400).json( {error: "User does not exist"} );
            }

            const review_list = user_data.reviewIds;

            const index = review_list.indexOf(review_id);

            if (index != -1) {
                review_list.splice(index, 1);
            }

            await Review.deleteOne({reviewId: review_id});
            await User.findOneAndUpdate({uid: user_id}, {reviewIds: review_list});
            await predictController.updateUser(user_id);
            res.status(200).json( {message: "Deleted the review successfully"} );

        } catch (error) {
            console.error("Error in deleteReview:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },
}

module.exports = reviewController;
