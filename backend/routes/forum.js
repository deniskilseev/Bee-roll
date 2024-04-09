const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const verifyToken = require('../middleware/auth');

router.post('/createForum', verifyToken, forumController.createForum);
router.post('/joinForum', verifyToken, forumController.joinForum);
router.post('/banUser', verifyToken, forumController.banUser);
router.post('/unbanUser', verifyToken, forumController.unbanUser);
router.get('/:title', forumController.getForum);
router.post('/togglePrivate', verifyToken, forumController.togglePrivate);
router.post('/addModerator', verifyToken, forumController.addModerator);
router.post('/removeModerator', verifyToken, forumController.removeModerator);
router.put('/changeTitle', verifyToken, forumController.putTitle);
router.get('/', forumController.getAllForums);

// Export the router
module.exports = router;
