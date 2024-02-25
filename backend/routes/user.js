const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);

// Export the router
module.exports = router;