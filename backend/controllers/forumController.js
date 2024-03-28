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
    },

    async joinForum(req, res) {
        try {
            const {forumId, memberId} = req.body;

            const forum = await Forum.findOne({forumId: forumId});
            if (!forum) {
                return res.status(400).json({error: "Forum with such name does not exists"})
            }

            const member = await User.findOne({uid: memberId})
            if (!member) {
                return res.status(400).json({error: "User with such id does not exists"})
            }

            member.forumIds.push(forumId)
            forum.userIds.push(memberId)

            await member.save()
            await forum.save()

            console.log("Forum joined successfully: ", forumId, " user being ", memberId)
            return res.status(201).json({message: "Forum joined successfully"})
        } catch (error) {
            console.error("Error in createForum:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async getForum(req, res) {
        const forumTitle = req.params.title
        const forum = await Forum.findOne({forumTitle: forumTitle});

        if (!forum) {
            return res.status(404).json({error: "Forum with such name does not exists"})
        }
        
        forum.moderatorIds = undefined;

        return res.status(200).json(forum);
    },

    async togglePrivate(req, res) {
        try {
            const {forumId} = req.body;

            const forum_info = await Forum.findOne( {forumId: forumId} );
    
            if(!forum) {
                return res.status(400).json( {error: "Forum with such name does not exist"} );
            }
            
            const updated_private = !forum_info.isPrivate;

            await Forum.findOneAndUpdate( {forumId: forumId}, {isPrivate: updated_private} );
            return res.status(200).json( {message: "Changed Visibility of the forum"} );
        } catch {
            console.error("Error in createForum:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = forumController;
