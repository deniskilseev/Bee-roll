const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/getInfo/:movie_id', movieController.getMovieInfo);
router.get('/find/:pattern', movieController.findMoviesWithPattern)
router.get('/getMovies', movieController.getAllMovies);

// Export the router
module.exports = router;
