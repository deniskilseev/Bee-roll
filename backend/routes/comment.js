const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/auth');

router.post('/createComment', verifyToken, commentController.createComment);
router.delete('/deleteComment', verifyToken, commentController.deleteComment);
router.get('/:commentId', commentController.getComment);


// Export the router
module.exports = router;