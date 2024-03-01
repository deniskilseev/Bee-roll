const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/createPost', postController.createPost);
router.get('/getPost/:post_id', postController.getPostInfo);
router.delete('/deletePost/{$postId}', postController.deletePost);

// Export the router
module.exports = router;
