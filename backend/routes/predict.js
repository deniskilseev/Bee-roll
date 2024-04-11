const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');
const verifyToken = require('../middleware/auth')

router.get("/similarMovie/:movie_id", verifyToken, predictController.similarMovie);
router.get("/predictUser/:user_id", verifyToken, predictController.predictUser);
router.get("/similarUser/:user_id", verifyToken, predictController.similarUser)

// Export the router

module.exports = router
