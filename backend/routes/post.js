const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/createPost', postController.createPost);

// Export the router
module.exports = router;