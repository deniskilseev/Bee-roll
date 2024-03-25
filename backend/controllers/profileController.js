// profileController.js

const multer = require('multer');
const path = require('path');
const User = require('../model/User');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, 'profile_picture_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('profilePicture');

const profileController = {
  async updateUserProfile(req, res) {
    try {
      const { uid, username, bio, profilePicture } = req.body;

      // Find the user by UID
      const user = await User.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user data
      user.username = username;
      user.bio = bio;
      user.profilePicture = profilePicture;

      // Save the updated user
      await user.save();

      console.log("Profile updated successfully:", username);
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getUserProfile(req, res) {
    try {
      const { userId } = req.params;

      // Find the user by UID
      const user = await User.findOne({ uid: userId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove sensitive information (if needed) before sending to the client
      const userProfile = {
        uid: user.uid,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
      };

      res.status(200).json(userProfile);
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async uploadProfilePicture(req, res) {
    try {
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ error: "Failed to upload profile picture" });
        } else if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        const profilePictureUrl = '/uploads/' + req.file.filename;

        // Update user's profile picture in the database
        // Assuming the user's UID is available in req.user.uid
        // Replace it with the appropriate field if different
        const user = await User.findOneAndUpdate({ uid: req.user.uid }, { profilePicture: profilePictureUrl }, { new: true });

        res.json({ profilePicture: profilePictureUrl });
      });
    } catch (error) {
      console.error("Error in uploading profile picture:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = profileController;
