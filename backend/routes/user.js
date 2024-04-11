const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth')
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.put('/putUser', verifyToken, userController.putUser);
router.get('/getUser/:user_id', userController.getUser);
router.get('/getUserByUsername/:username', userController.getUserByUsername);
router.post('/followUser', verifyToken, userController.followUser);
router.post('/unfollowUser', verifyToken, userController.unfollowUser);
router.get('/search/:query', userController.searchUsers);
router.post('/uploadProfilePicture', verifyToken, upload.single('profile-picture'), userController.uploadProfilePicture);
router.get('/getProfilePicture/:userLogin', userController.downloadProfilePicture);
router.get('/getSelf', verifyToken, userController.getUserByToken);


// Export the router
module.exports = router;
