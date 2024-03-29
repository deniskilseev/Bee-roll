const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');

router.get("/similarMovie/:movie_id", predictController.similarMovie);
router.get("/predictUser/:user_id", predictController.predictUser);

// Export the router

module.exports = router
