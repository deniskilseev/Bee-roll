const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  uid: Number,
  login: String,
  password: String,
  email: String,
  date_of_birth: Date,
  watchListsIds: [Number],
  postsIds: [Number],
  chatsIds: [Number],
  forumIds: [Number],
  profilePicture: String
});

const User = model('User', userSchema);
module.exports = User;
