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
      const tempId = req.params.userId;

      // Find the user by UID
      const user = await User.findOne({ uid });

      console.log("This is the uid: ", uid);
      console.log("This is the req userID: ", tempId);

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

      console.log("get profile test");
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
    console.log("Entered method")
    try {
      const userId = req.body.userId;
      console.log("req body: ", req.body);

      // Find the user by UID
      //const user = await User.findOne({ uid: userId });

      console.log("Testing userId: ", userId);
      console.log("Test 2")
      if (!userId) {
        console.log("am i here");
        return res.status(404).json({ error: "User not found" });
      }

      console.log("test 2 passed")

      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ error: "Failed to upload profile picture" });
        } else if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        const profilePictureUrl = '/uploads/' + req.files.filename;

        // Update user's profile picture in the database
        // Assuming the user's UID is available in req.user.uid
        // Replace it with the appropriate field if different
        //const user = await User.findOne({ uid: userId });
        user.profilePicture = profilePictureUrl;
        await user.save();
        console.log("Profile updated successfully:");
        res.json({ profilePicture: profilePictureUrl });
      });
    } catch (error) {
      console.error("Error in uploading profile picture:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = profileController;
