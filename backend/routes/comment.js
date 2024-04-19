const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/auth');

router.post('/createComment', verifyToken, commentController.createComment);
router.delete('/deleteComment', verifyToken, commentController.deleteComment);
router.get('/:commentId', commentController.getComment);
router.put('/upvote/:comment_id', verifyToken, commentController.upvoteComment);
router.put('/downvote/:comment_id', verifyToken, commentController.downvoteComment);
router.put('/revoke/:comment_id', verifyToken, commentController.revokeVote);


// Export the router
module.exports = router;