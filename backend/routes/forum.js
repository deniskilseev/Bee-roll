const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.post('/createForum', forumController.createForum);

// Export the router
module.exports = router;