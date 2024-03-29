const Review = require('../model/Review.js')
const User = require('../model/User.js')
const Movie = require('../model/Movie')
const Request = require('request')

const url = 'http://localhost:8000'

const predictController = {

    async similarMovie(req, res) {
        try {
            const {movie_id} = req.params;
            const movie_info = Movie.findOne({movieId: movie_id});

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
                console.log(data);
                return res.status(200).json(data);
            }

            console.log("Error in the Machine Learning server");
            return res.status(500).json( {error: "Internal server error"} );
        } catch (error) {
            console.error("Error in similarMovie:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async similarUser(req, res) {
        try {
            const {user_id} = req.params;

            const user_info = User.findOne( {uid: user_id} );

            if (!user_info) {
                return res.status(400).json( {error: "No user with such ID"} );
            }

            return res.status(404).json( {message: "Not yet implemented"} ); 

            /*const request = new Request(url + "/predictUser", {
                method: "POST",
                body: {
                    },
            });*/

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
                needed_user_history.reviews.push({movieId: review.movieId, rating: review.rating});
            }

            const update = new Request(url + "/updateUser", {
                    method: "POST",
                    body: JSON.stringify(needed_user_history),
                }
            );

            fetch(update);

            return ;

        } catch (error) {
            console.error("Error in updateUser:", error);
            return ;
        }
    }
}

module.exports = predictController;
