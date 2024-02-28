const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');

router.post("/createWatchlist", watchListController.createWatchlist);
router.get("/getWatchlist", watchListController.getWatchlist);
router.post("/editWatchlist", watchListController.editWatchlist);

// Export the router
router.exports = router;
