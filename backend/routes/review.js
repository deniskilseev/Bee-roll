const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/createReview', reviewController.createReview);
router.get('/getReviews/:user_id', reviewController.getReviews);
router.post('/updateReview', reviewController.updateReview);
router.delete('/deleteReview/:review_id', reviewController.deleteReview)

// Export the router
module.exports = router;
