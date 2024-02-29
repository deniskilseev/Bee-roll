const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/getInfo', movieController.getMovieInfo);
router.get('/find', movieController.findMoviesWithPattern)

// Export the router
module.exports = router;
