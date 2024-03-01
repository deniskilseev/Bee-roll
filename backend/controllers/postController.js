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
    async getPost(req, res) {

        const postId = req.params.postId
        const post = await Post.findOne({postId: postId});

        if (!post) {
            return res.status(400).json({error: "Post does not exists"})
        }

        post.forumId = undefined;

        return res.status(200).json(post);
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

    }
}

module.exports = postController;