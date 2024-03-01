const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/createPost', postController.createPost);
router.get('/:postId', postController.getPost);
router.post('/pinPost', postController.pinPost);


// Export the router
module.exports = router;