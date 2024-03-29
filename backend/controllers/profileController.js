// profileController.js
const multer = require('multer');
const path = require('path');
const User = require('../model/User');
const multiparty = require('multiparty');
const fs = require('fs');



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
      const user = await User.findOne({ uid: uid });

      console.log("This is the uid: ", uid);
      console.log("This is the req userID: ", tempId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user data
      user.login = username;
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
      const form = new multiparty.Form();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        const userId = fields.userId[0]; // Assuming userId is in the fields
  
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }
  
        const user = await User.findOne({ uid: userId });
  
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const profilePicture = files.profilePicture[0]; // Assuming profilePicture is the name of the file input
  
        if (!profilePicture) {
          return res.status(400).json({ error: 'Profile picture is required' });
        }
  
        const tempPath = profilePicture.path;
        const targetPath = path.join(__dirname, '..', 'uploads', profilePicture.originalFilename);
  
        // Move the uploaded file to the desired location
        fs.rename(tempPath, targetPath, async (err) => {
          if (err) {
            console.error('Error moving file:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          // Update user's profile picture in the database
          user.profilePicture = '/uploads/' + profilePicture.originalFilename;
          await user.save();
  
          console.log('Profile picture uploaded successfully');
          res.status(200).json({ message: 'Profile picture uploaded successfully' });
        });
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = profileController;
