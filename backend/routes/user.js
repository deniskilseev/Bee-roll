const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth')

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.put('/putUser', verifyToken, userController.putUser);
router.get('/getUser/:user_id', userController.getUser);
router.get('/getUserByUsername/:username', userController.getUserByUsername);
router.post('/followUser', verifyToken, userController.followUser);
router.post('/unfollowUser', verifyToken, userController.unfollowUser);
router.get('/search/:query', userController.searchUsers);

// Export the router
module.exports = router;