const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Add a route for updating user profile
router.post('/updateprofile', profileController.updateUserProfile);
router.get('/profile/:userId', profileController.getUserProfile);
router.post('/upload-profile-picture', profileController.uploadProfilePicture);


module.exports = router;
