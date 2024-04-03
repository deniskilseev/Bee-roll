const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');
const verifyToken = require('../middleware/auth');

router.post('/createWatchlist', verifyToken, watchListController.createWatchList);
router.post('/addMovie', verifyToken, watchListController.addMovie);
router.post('/removeMovie', verifyToken, watchListController.removeMovie)
router.get('/getWatchlist/:watchlist_id', verifyToken, watchListController.getWatchList);
router.delete('/deleteWatchlist/:watchlist_id', verifyToken, watchListController.deleteWatchList);

// Export the router
module.exports = router;
