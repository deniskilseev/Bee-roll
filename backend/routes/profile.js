const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middleware/auth');

// Add a route for updating user profile
router.post('/updateprofile', verifyToken, profileController.updateUserProfile);
router.get('/profile/:userId', verifyToken, profileController.getUserProfile);
router.post('/upload-profile-picture', verifyToken, profileController.uploadProfilePicture);


module.exports = router;
