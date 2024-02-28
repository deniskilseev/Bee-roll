const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const Forum = require('../model/Forum.js')
const User = require('../model/User.js')

const forumController = {
    async createForum(req, res) {
        try {
            const {forumTitle, creatorId} = req.body;
            
            const existing_title = await Forum.findOne({forumTitle: forumTitle});
            if (existing_title) {
                return res.status(400).json({error: "Forum with such name exists"})
            }
            
            const counter_fetch = await Counter.findOne({_id: "Forum"});
            const forum_counter_value = counter_fetch.collectionCounter
            const forumId = counter_fetch.collectionCounter + 1

            const newForum = new Forum({
                forumId: forumId,
                forumTitle: forumTitle,
                creatorId: creatorId,
                userIds: Number(creatorId)
            });

            await newForum.save()
            await Counter.findOneAndUpdate({_id: "Forum"}, {collectionCounter: forumId});

            await User.findOneAndUpdate(
                { uid: creatorId},
                { $push: {forumIds: forumId}},
                { new: true}
            );

            console.log("Forum created successfully: ", forumTitle)
            return res.status(201).json({message: "Forum created successfully"})
        } catch (error) {
            console.error("Error in createForum:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = forumController;