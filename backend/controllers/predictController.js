const Review = require('../model/Review.js')
const User = require('../model/User.js')
const Movie = require('../model/Movie')
const Request = require('request')

const url = 'http://localhost:8000'

const predictController = {

    async similarMovie(req, res) {
        try {
            const {movie_id} = req.params;
            const movie_info = await Movie.findOne({movieId: movie_id});

            if (!movie_info) {
                return res.status(400).json( {error: "No movie with such ID"} );
            }
                
            const uri = url + '/similarMovies?movieId=' + movie_id;

            const options = {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                }
            };

            const movie_recommendation = await fetch(uri, options);

            if (movie_recommendation.status == 200) {
                const data = await movie_recommendation.json();
                return res.status(200).json(data);
            }

            console.log("Error in the Machine Learning server");
            return res.status(500).json( {error: "Internal server error"} );
        } catch (error) {
            console.error("Error in similarMovie:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async predictUser(req, res) {
        try {
            const user_info = await User.findOne( {login: req.user.login} );

            if (!user_info) {
                return res.status(400).json( {error: "No user with such ID"} );
            }

            const user_id = user_info.uid;

            await predictController.updateUser(user_id); // Updating model before predicting

            const user_history = await Review.find( {userId: user_id} );
            const needed_user_history = { userId: user_id, reviews: [] };

            for (review of user_history) {
                needed_user_history.reviews.push({movieId: review.movieId, rating: review.review});
            }

            const uri = url + '/predictUser'
            const options = {
                method: "POST",
                body: JSON.stringify(needed_user_history),
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const movie_recommendation = await fetch(uri, options);

            if (movie_recommendation.status == 200) {
                data = await movie_recommendation.json();
                if (data.status_code == 412) {
                    return res.status(412).json( {error: "User needs more reviews to be recommended movies"} );
                }
                return res.status(200).json(data);
            }

            console.log("Error in the Machine Learning server");
            return res.status(500).json( {error: "Internal server error"} );


        } catch (error) {
            console.error("Error in predictUser:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async similarUser(req, res) {
        try {
            const user_info = await User.findOne( {login: req.user.login} );

            if (!user_info) {
                return res.status(400).json( {error: "No user with such ID"} );
            }

            const user_id = user_info.uid;

            await predictController.updateUser(user_id); // Updating model before predicting

            const uri = url + '/similarUsers?userId=' + user_id;

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const similar_users = await fetch(uri, options);

            if (similar_users.status == 200) {
                data = await similar_users.json()
                return res.status(200).json(data);
            }

            console.log("Error in the Machine Learning server");
            return res.status(500).json( {error: "Internal server error"} );

        } catch (error) {
            console.error("Error in similarUser:", error);
            res.status(500).json( {error: "Internal server error"} );
        }
    },

    async updateUser(user_id) {
        try {
           const user_info = await User.findOne({uid: user_id});

            if (! user_info) {
                return ;
            }
            
            const user_history = await Review.find( {userId: user_id} );
            const needed_user_history = { userId: user_id, reviews: [] };

            for (review of user_history) {
                needed_user_history.reviews.push({movieId: review.movieId, rating: review.review});
            }

            const uri = url + '/updateUser'
            const options = {
                method: "POST",
                body: JSON.stringify(needed_user_history),
                headers: {
                    "Content-Type": "application/json",
                }
            }

            await fetch(uri, options);

            return ;

        } catch (error) {
            console.error("Error in updateUser:", error);
            return ;
        }
    }
}

module.exports = predictController;