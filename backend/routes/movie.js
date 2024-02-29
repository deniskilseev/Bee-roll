const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieContoller');

router.get('/getInfo', movieController.getMovieInfo);

// Export the router
module.exports = router;
