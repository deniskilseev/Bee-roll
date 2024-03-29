const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/createPost', postController.createPost);
router.post('/pinPost', postController.pinPost);
router.get('/getPost/:post_id', postController.getPostInfo);
router.delete('/deletePost/:post_id', postController.deletePost);
router.post('/getRecentPosts', postController.getRecentPosts);


// Export the router
module.exports = router;
