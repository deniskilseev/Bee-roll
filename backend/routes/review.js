const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/auth');

router.post('/createReview', verifyToken, reviewController.createReview);
router.get('/getReviews', verifyToken, reviewController.getReviews);
router.post('/updateReview', verifyToken, reviewController.updateReview);
router.get('/getAverage/:movieId', reviewController.averageRating);
router.get('/getPostReviews/:postId', reviewController.getReviewByPostId);
router.delete('/deleteReview/:review_id', verifyToken, reviewController.deleteReview);

// Export the router
module.exports = router;
