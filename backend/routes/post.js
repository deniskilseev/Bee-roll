const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verifyToken = require('../middleware/auth');

router.post('/createPost', verifyToken, postController.createPost);
router.post('/pinPost', verifyToken, postController.pinPost);
router.get('/getPost/:post_id', postController.getPostInfo);
router.delete('/deletePost/:post_id', verifyToken, postController.deletePost);
router.post('/getRecentPosts', verifyToken, postController.getRecentPosts);
router.put('/upvote/:post_id', verifyToken, postController.upvotePost);
router.put('/downvote/:post_id', verifyToken, postController.downvotePost);
router.put('/revoke/:post_id', verifyToken, postController.revokeVote);

// Export the router
module.exports = router;
