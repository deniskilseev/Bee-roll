const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.post('/createForum', forumController.createForum);
router.post('/joinForum', forumController.joinForum);
router.get('/:title', forumController.getForum);
router.post('/togglePrivate', forumController.togglePrivate);
router.post('/addModerator', forumController.addModerator);
router.post('/removeModerator', forumController.removeModerator);
router.get('/forums', forumController.getAllForums);
router.delete('/deletePost/:post_id', forumController.deletePost);

// Export the router
module.exports = router;
