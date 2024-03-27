const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');

router.post('/createWatchlist', watchListController.createWatchList);
router.post('/addMovie', watchListController.addMovie);
router.post('/removeMovie', watchListController.removeMovie)
router.get('/getWatchlist/:watchlist_id', watchListController.getWatchList);
router.delete('/deleteWatchlist/:watchlist_id', watchListController.deleteWatchList);

// Export the router
module.exports = router;
