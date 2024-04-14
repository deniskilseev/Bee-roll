const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');
const verifyToken = require('../middleware/auth')

router.get("/similarMovie/:movie_id", verifyToken, predictController.similarMovie);
router.get("/predictUser", verifyToken, predictController.predictUser);
router.get("/similarUser", verifyToken, predictController.similarUser)

// Export the router

module.exports = router
