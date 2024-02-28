const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');

router.post('/createWatchlist', watchListController.createWatchList);
router.post('/editWatchlist', watchListController.editWatchList);
router.get('/getWatchlist', watchListController.getWatchList);

// Export the router
module.exports = router;
