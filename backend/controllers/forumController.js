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

        return res.status(200).json(forum);
    },

    async addModerator(req, res) {
        try {
            const {to_add_id, who_adds_id, forum_id} = req.body;
            
            const forum_info = await Forum.findOne( {forumId: forum_id} );

            if (!forum_info) {
                return res.status(400).json( {error: "Forum does not exist"} );
            }

            const user_info = await User.findOne( {uid: to_add_id} );
            
            if (!user_info) {
                return res.status(400).json( {error: "The person who you are trying to add does not exist"} );
            }

            const moderator_list = forum_info.moderatorIds;
            const moderator_index = moderator_list.indexOf(who_adds_id);

            if (forum_info.creatorId == who_adds_id || moderator_index != -1) {
                moderator_list.push(to_add_id);
                await Forum.findOneAndUpdate({forumId: forum_id}, {moderatorIds: moderator_list});
                return res.status(200).json( {message: "OK"});
            }

            return res.status(403).json( {message: "Unauthorized"} );

        } catch (error) {
            console.error("Error in addModerator", error);
            res.status(500).json( {error: "Internal server error"} );
        }
    },

    async removeModerator(req, res) {
        try {
            const {to_remove_id, who_removes_id, forum_id} = req.body;
            
            const forum_info = await Forum.findOne({forumId: forum_id});

            if (!forum_info) {
                return res.status(400).json( {error: "Forum does not exist"} );
            }

            const user_info = await User.findOne({uid: to_remove_id});
            
            if (!user_info) {
                return res.status(400).json( {error: "The person who you are trying remove does not exist"} );
            }

            const moderator_list = forum_info.moderatorIds;
            const index = moderator_list.indexOf(to_remove_id);

            if (forum_info.creatorId == who_removes_id) {
                if (index != -1) {
                   moderator_list.splice(index, 1); 
                }

                await Forum.findOneAndUpdate({forumId: forum_id}, {moderatorIds: moderator_list});

                return res.status(200).json( {message: "OK" });
            }

            return res.status(403).json( {message: "Unauthorized"} );
        } catch (error) {
            console.error("Error in removeModerator", error);
            res.status(500).json( {error: "Internal server error"} );
        }
    },

    async togglePrivate(req, res) {
        try {
            const {forumId} = req.body;

            const forum_info = await Forum.findOne( {forumId: forumId} );
    
            if(!forum_info) {
                return res.status(400).json( {error: "Forum with such name does not exist"} );
            }
            
            const updated_private = !forum_info.isPrivate;

            await Forum.findOneAndUpdate( {forumId: forumId}, {isPrivate: updated_private} );
            return res.status(200).json( {message: "Changed Visibility of the forum"} );
        } catch (error) {
            console.error("Error in togglePrivate:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async banUser(req, res) {
        try {
            const {modId, userId, forumId} = req.body;

            const forum = await Forum.findOne({forumId: forumId});
    
            if(!forum) {
                return res.status(404).json( {error: "Forum with such ID does not exist"} );
            }
    
            const user = await User.findOne({uid: userId});
    
            if(!user) {
                return res.status(404).json( {error: "User with such id does not exist"} );
            }
    
            const mod = await User.findOne({uid: modId});
    
            if(!mod || !forum.moderatorIds.includes(modId) && forum.creatorId != modId) {
                return res.status(404).json( {error: "Mod with such id does not exist"} );
            }
    
            forum.bannedUserIds.push(userId);
            forum.userIds.pull(userId);
            user.forumIds.pull(forumId);

            await forum.save();
            await user.save();

            return res.status(200).json({message: "User banned succesfully"});
        } catch (error) {
            console.error("Error in banUser:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async unbanUser(req, res) {
        try {
            const {modId, userId, forumId} = req.body;

            const forum = await Forum.findOne({forumId: forumId});
    
            if(!forum) {
                return res.status(404).json( {error: "Forum with such ID does not exist"} );
            }
    
            const user = await User.findOne({uid: userId});
    
            if(!user || !forum.bannedUserIds?.includes(userId)) {
                return res.status(404).json( {error: "User with such id does not exist"} );
            }
    
            const mod = await User.findOne({uid: modId});
    
            if(!mod || !forum.moderatorIds.includes(modId) && forum.creatorId != modId) {
                return res.status(404).json( {error: "Mod with such id does not exist"} );
            }
            forum.bannedUserIds.pull(userId);
            await forum.save();

            return res.status(200).json({message: "User unbanned succesfully"});
        } catch (error) {
            console.error("Error in unbanUser:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    }
}

module.exports = forumController;
