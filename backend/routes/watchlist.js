const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');
const verifyToken = require('../middleware/auth');

router.post('/createWatchlist', verifyToken, watchListController.createWatchList);
router.post('/addMovie', verifyToken, watchListController.addMovie);
router.post('/removeMovie', verifyToken, watchListController.removeMovie);
router.get('/getWatchlist/:watchlistId', verifyToken, watchListController.getWatchList);
router.post('/togglePublic', verifyToken, watchListController.togglePublic);
router.post('/followWatchlist', verifyToken, watchListController.followWatchlist);
router.post('/unfollowWatchlist', verifyToken, watchListController.unfollowWatchlist);
router.put('/changeTitle', verifyToken, watchListController.changeWatchListName);
router.delete('/deleteWatchlist/:watchlistId', verifyToken, watchListController.deleteWatchList);

// Export the router
module.exports = router;
