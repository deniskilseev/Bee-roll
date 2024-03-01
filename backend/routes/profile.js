const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Add a route for updating user profile
router.post('/updateprofile', profileController.updateUserProfile);
router.get('/profile/:userId', profileController.getUserProfile);

module.exports = router;
