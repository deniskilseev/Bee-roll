const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const User = require('../model/User.js')



const userConroller = {
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
            const data = await Counter.findOne({_id: "User"})
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
    }
}

module.exports = userConroller;