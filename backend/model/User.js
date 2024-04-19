const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  uid: Number,
  login: String,
  password: String,
  email: String,
  bio: String,
  date_of_birth: Date,
  watchListsIds: [Number],
  postsIds: [Number],
  chatsIds: [Number],
  forumIds: [Number],
  reviewIds: [Number],
  followsIds: [Number],
  followersIds: [Number],
  profilePicture: {
    data: { type: Buffer, default: Buffer.from([]) },
    type: { type: String, default: '' }
  },
  isAdmin: Boolean,
  commentIds: [Number],
  followedWatchListsIds: [Number],
  upvotedPosts: [Number],
  downvotedPosts: [Number],
  warnings: { type: Number, default: 0 },
  warningDescription: String
});

const User = model('User', userSchema);
module.exports = User;
