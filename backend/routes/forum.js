const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.post('/createForum', forumController.createForum);
router.post('/joinForum', forumController.joinForum);
router.get('/:title', forumController.getForum);
router.post('/togglePrivate', forumController.togglePrivate);

// Export the router
module.exports = router;
