const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const User = require('../model/User.js')
const JWT_SECRET = require('../secrets/jwt')
const jwt = require('jsonwebtoken')

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
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
            console.log("body: ", req.body);

            data_by_username = await User.findOne({login: username});
            const verified_password = data_by_username.password == password;

            if (!data_by_username || !verified_password) {
                console.log("Access denied for" + username);
                return res.status(401).json({error: "Access denied."});
            }

            data_by_username.password = undefined; // delete password from data.
    
            const token = jwt.sign({ login: data_by_username.login }, JWT_SECRET, {expiresIn: '1hr'});

            return res.status(200).json({data_by_username, token: token});
        } catch (error) {
            console.error("Error in loginUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async putUser(req, res) {
        try {
            const {username, email, password, date_of_birth} = req.body;
            const oldUser = req.user.login;
            const user = await User.findOne({login: oldUser})
            
            if (!user) {
                return res.status(404).json({error: "User wasn't found"})
            }

            const user_by_email = await User.findOne({email: email});

            if (user_by_email && user_by_email.login != username) {
                return res.status(400).json({error: "User with such email exists!"})
            }

            user.login = username;
            user.email = email;
            user.password = password;
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
            const {user_followed} = req.body;
            const user_follower = req.user.login;

            const user_follower_profile = await User.findOne({login: user_follower});
            const user_followed_profile = await User.findOne({login: user_followed});

            if (!user_follower_profile || !user_followed_profile) {
                return res.status(404).json({message: "Users were not found!"});
            }
            
            follower_id = user_follower_profile.uid;
            followed_id = user_followed_profile.uid;
            
            if (!user_follower_profile.followsIds.includes(followed_id)) {
                user_follower_profile.followsIds.push(followed_id);
                user_followed_profile.followersIds.push(follower_id);
            }

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
            const {user_followed} = req.body;
            const user_follower = req.user.login; // id from token

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
            const { user_id } = req.params;
    
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
    },

    async getUserByUsername(req, res) {
        try {
            const { username } = req.params;
    
            // Find the user based on the UID
            const user_info = await User.findOne({ login: username });
    
            if (!user_info) {
                return res.status(404).json({ error: "User not found" });
            }
    
            user_info.password = undefined;
    
            res.status(200).json({ user_info });
        } catch (error) {
            console.error("Error in getUser:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async searchUsers (req, res) {
        try {
            const {query} = req.params;

            const regex = new RegExp(escapeRegExp(query), "gi");

            const users = await User.find( {login: regex} );

          // Assuming User model has a field called 'username' for searching
          //const users = await User.find({ username: { $regex: query, $options: 'i' } }).limit(1);
          res.json({ users });
        } catch (error) {
          console.error('Error searching users:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
    },

    async uploadProfilePicture(req, res) {
        try {
            const user_login = req.user.login;
            // Check if the user exists
            const user = await User.findOne({login: user_login});

            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }

            user.profilePicture.data = req.file.buffer;
            user.profilePicture.type = req.file.mimetype;
            await user.save();
        
            return res.status(200).json({ message: 'Profile picture uploaded successfully' });
        } catch (error) {
            console.error('Error uploading profile picture: ', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async downloadProfilePicture(req, res) {
        const user_login = req.params.userLogin;

        try {
          // Retrieve the user from MongoDB
          const user = await User.findOne({login: user_login});
      
          if (!user || !user.profilePicture) {
            return res.status(404).json({ error: 'User or profile picture not found' });
          }
      
          // Set response headers
          res.set('Content-Type', user.profilePicture.type);
          res.send(user.profilePicture.data);
          res.status(200);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserByToken(req, res) {
        try {
            const login = req.user.login;
            const data_by_username = await User.findOne( {login: login} );
            if (!data_by_username) {
                return res.status(401).json( {error: "Access denied."} );
            }

            data_by_username.password = undefined;

            const token = jwt.sign({ login: data_by_username.login }, JWT_SECRET, {expiresIn: '1hr'});

            return res.status(200).json({data_by_username, token: token});

        } catch (error) {
            console.error("Error in getUserByToken:", error);
            res.status(500).json( {error: "Internal Server Error"} );
        }
    },
}

module.exports = userController;
