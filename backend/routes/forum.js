const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.post('/createForum', forumController.createForum);
router.post('/joinForum', forumController.joinForum);

// Export the router
module.exports = router;