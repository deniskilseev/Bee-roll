const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');

router.get("/similarMovie/:movie_id", predictController.similarMovie);

// Export the router

module.exports = router
