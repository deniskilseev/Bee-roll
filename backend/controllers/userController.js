const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const User = require('../model/User.js')



const userController = {
    async createUser(req, res) {
        try {
            const {username, password, email} = req.body;
    
            // Look for existing users
            const data_by_username = await User.findOne({login: username})
            const data_by_email = await User.findOne({email: email})
    
            if (data_by_username || data_by_email) {
                console.log("Error")
                return res.status(400).json({ error: "Username or email already exists" });
            }
            
            // Counter for UID. Basically enforces auto-increment.
            // const data = await Counter.findOne({_id: "User"})
            const data_request = await Counter.findOne({_id: "User"})
            const counter_value = data_request.collectionCounter

            // New user submission
            const newUser = new User({
                uid: counter_value + 1,
                login: username,
                password: password,
                email: email,
                }
              )

            await newUser.save() // Save user
            await Counter.findOneAndUpdate({_id: "User"}, {collectionCounter: counter_value + 1}) // Update auto-increment
            console.log("User created successfully: ", username)
            return res.status(201).json({message: "User created successfully"})
        } catch (error) {
            console.error("Error in createUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async loginUser(req, res) {
        try {
            const {username, password} = req.body;

            data_by_username = await User.findOne({login: username});
            const verified_password = data_by_username.password == password;

            if (!data_by_username || !verified_password) {
                console.log("Access denied for" + username);
                return res.status(401).json({error: "Access denied."});
            }

            data_by_username.password = undefined; // delete password from data.

            res.status(200).json({data_by_username});

        } catch (error) {
            console.error("Error in loginUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async putUser(req, res) {
        try {
            // const {username, password, email, date_of_birth} = req.body;
            const {oldUser, username, email, date_of_birth} = req.body;
            
            const user = await User.findOne({login: oldUser})
            
            if (!user) {
                return res.status(404).json({error: "User wasn't found"})
            }

            // user.password = password;

            const user_by_email = await User.findOne({email: email});

            // if (user_by_email && user_by_email.login != username) {
            //     return res.status(400).json({error: "User with such email exists!"})
            // }

            user.login = username;
            user.email = email;
            user.date_of_birth = date_of_birth;

            await user.save();

            res.status(200).json({message: "Data updated successfully"});
        } catch (error) {
            console.error("Error in putUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async followUser(req, res) {
        try {
            const {user_follower, user_followed} = req.body;

            const user_follower_profile = await User.findOne({login: user_follower});
            const user_followed_profile = await User.findOne({login: user_followed});

            if (!user_follower_profile || !user_followed_profile) {
                return res.status(404).json({message: "Users were not found!"});
            }
            
            follower_id = user_follower_profile.uid;
            followed_id = user_followed_profile.uid;

            user_follower_profile.followsIds.push(followed_id);
            user_followed_profile.followersIds.push(follower_id);

            await user_follower_profile.save();
            await user_followed_profile.save();

            res.status(200).json({message: "Data updated successfully"});
        } catch (error) {
            console.error("Error in followUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async unfollowUser(req, res) {
        try {
            const {user_follower, user_followed} = req.body;

            const user_follower_profile = await User.findOne({login: user_follower});
            const user_followed_profile = await User.findOne({login: user_followed});

            if (!user_follower_profile || !user_followed_profile) {
                return res.status(404).json({message: "Users were not found!"});
            }
            
            follower_id = user_follower_profile.uid;
            followed_id = user_followed_profile.uid;

            user_follower_profile.followsIds.pull(followed_id);
            user_followed_profile.followersIds.pull(follower_id);

            await user_follower_profile.save();
            await user_followed_profile.save();

            res.status(200).json({message: "Data updated successfully"});
        } catch (error) {
            console.error("Error in unfollowUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async getUser(req, res) {
        try {    
            // Find the user based on the UID
            const user_info = await User.findOne({ uid: user_id });
    
            if (!user_info) {
                return res.status(404).json({ error: "User not found" });
            }
    
            user_info.password = undefined;
    
            res.status(200).json({ user_info });
        } catch (error) {
            console.error("Error in getUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = userController;