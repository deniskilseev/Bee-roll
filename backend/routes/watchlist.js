const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');

router.post('/createWatchlist', watchListController.createWatchList);
router.post('/addMovie', watchListController.addMovie);
router.post('/removeMovie', watchListController.removeMovie)
router.get('/getWatchlist/:watchlist_id', watchListController.getWatchList);
router.delete('/deleteWatchlist', watchListController.deleteWatchList);
router.get('/predictmovies/:watchlist_id', watchListController.predictMovies);

// Export the router
module.exports = router;
