const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const Forum = require('../model/Forum.js')
const User = require('../model/User.js')
const Post = require('../model/Post.js')

const postController = {
    async createPost(req, res) {
        try {
            const {creatorId, forumId, postTitle, postText} = req.body;
            
            const counter_fetch = await Counter.findOne({_id: "Post"});
            const post_counter_value = counter_fetch.collectionCounter
            const post_number = post_counter_value + 1
            const newPost = new Post({
                postId: post_number,
                userId: creatorId,
                forumId: forumId,
                postTitle: postTitle,
                postText: postText
            });

            await newPost.save()
            await Counter.findOneAndUpdate({_id: "Post"}, {collectionCounter: post_number});

            await User.findOneAndUpdate(
                { uid: creatorId},
                { $push: {postsIds: post_number}},
                { new: true}
            );

            await Forum.findOneAndUpdate(
                { forumId: forumId},
                { $push: {postIds: post_number}},
                { new: true}
            );

            console.log("Post created successfully: ", postTitle)
            return res.status(201).json({message: "Post created successfully"})
        } catch (error) {
            console.error("Error in createPost:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async pinPost(req, res) {
        try {
            const {postId, forumId} = req.body;

            const post = await Post.findOne({postId: postId});
    
            if (!post) {
                return res.status(400).json({error: "Post does not exists"})
            }
    
            const forum = await Forum.findOne({forumId: forumId});
    
            if (!forum) {
                return res.status(400).json({error: "Forum does not exists"})
            }

            forum.pinnedPost = postId;
            await forum.save()
            return res.status(200).json("Post pinned");
        } catch (error) {
            console.error("Error in pinPost:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async getPostInfo(req, res) {
        try {
            const {post_id} = req.params;

            const post_info = await Post.findOne( {postId: post_id} );

            if (!post_info) {
                return res.status(400).json( {error: "post_id does not exist"} );
            }

            return res.status(200).json( {post_info} );

        } catch (error) {
            console.error("Error in getPostInfo:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async deletePost(req, res) {
        try {
            const {post_id} = req.params;

            const post_info = await Post.findOne( {postId: post_id} );

            if (!post_info) {
                return res.status(400).json( {error: "post_id does not exist"} );
            }

            const user_id = post_info.userId;

            const user_info = await User.findOne( {uid: user_id} );

            if (!user_info) {
                return res.status(400).json( {error: "The owner of the post does not exist"} );
            }

            const post_ids = user_info.postIds;
            const index = post_ids.indexOf(post_id);

            if (index != -1) {
                post_ids.splice(index, 1);
            }

            await User.findOneAndUpdate( {uid: user_id}, {postIds: post_ids}); // Remove the post entry from User
            await Post.deleteOne( {postId: post_id} ); // Remove the post entry from database.

            return res.status(200).json( {message: "Deleted a post successfuly"});

        } catch (error) {
            console.error("Error in deletePost:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    }
}

module.exports = postController;
