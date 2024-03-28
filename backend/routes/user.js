const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.put('/putUser', userController.putUser);
router.post('/followUser', userController.followUser);
router.post('/unfollowUser', userController.unfollowUser);

// Export the router
module.exports = router;