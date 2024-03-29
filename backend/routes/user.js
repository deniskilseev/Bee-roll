const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.put('/putUser', userController.putUser);
router.get('/getUser/:user_id', userController.getUser);
router.get('/getUserByUsername/:username', userController.getUserByUsername);
router.post('/followUser', userController.followUser);
router.post('/unfollowUser', userController.unfollowUser);
router.get('/search/:query', userController.searchUsers);

// Export the router
module.exports = router;