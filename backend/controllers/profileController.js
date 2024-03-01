// Import necessary modules and models
const mongoose = require('mongoose');
const express = require('express');
const Counter = require('../model/Counter.js');
const User = require('../model/User.js');

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
};

module.exports = profileController;
