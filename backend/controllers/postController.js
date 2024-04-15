const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')
const Forum = require('../model/Forum.js')
const User = require('../model/User.js')
const Post = require('../model/Post.js')

const postController = {
    async createPost(req, res) {
        try {
            const {forumId, postTitle, postText} = req.body;

            const creator_info = await User.findOne( {login: req.user.login} );

            const creatorId = creator_info.uid;
 
            const forum_info = await Forum.findOne( {forumId: forumId} );

            if (!forum_info) {
                return res.status(400).json( {error: "Forum with such ID does not exist"} );
            }

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
            return res.status(201).json({message: "Post created successfully", postId: post_number});
        } catch (error) {
            console.error("Error in createPost:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async pinPost(req, res) {
        try {
            const {postId, forumId} = req.body;

            const post = await Post.findOne( {postId: postId}) ;

            if (!post) {
                return res.status(400).json( {error: "Post does not exists"} );
            }
    
            const forum = await Forum.findOne( {forumId: forumId} );
    
            if (!forum) {
                return res.status(400).json( {error: "Forum does not exists"} )
            }

            if (forum.forumId != post.forumId) {
                return res.status(400).json( {error: "The post does not belong to the forum"} )
            }

            const user_info = await User.findOne( {login: req.user.login} );

            const userId = user_info.uid;
            const index = forum.moderatorIds.indexOf(userId);

            if (index != -1 || userId == forum.creatorId) {
                forum.pinnedPost = postId;
                await forum.save()
                return res.status(200).json( {message: "Post pinned"} );
            }
            return res.status(403).json( {error: "Unauthorized"} );
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

            const delete_info = await User.findOne( {login: req.user.login} );

            const post_info = await Post.findOne( {postId: post_id} );

            if (!post_info) {
                return res.status(400).json( {error: "post_id does not exist"} );
            }

            const forum_id = post_info.forumId;

            const forum_info = await Forum.findOne( {forumId: forum_id} );

            if (!forum_info) {
                return res.status(400).json( {error: "The forum does not exist"} );
            }

            const user_id = post_info.userId;

            const user_info = await User.findOne( {uid: user_id} );

            if (!user_info) {
                return res.status(400).json( {error: "The owner of the post does not exist"} );
            }

            const delete_id = delete_info.uid;
            const index = forum_info.moderatorIds.indexOf(delete_id);

            if (delete_id == forum_info.creatorId || index != -1 || delete_id == user_id) {

                const user_post_ids = user_info.postsIds;
                const user_index = user_post_ids.indexOf(post_id);
          
                if (user_index != -1) {
                    user_post_ids.splice(user_index, 1);
                }

                const forum_post_ids = forum_info.postIds;
                const forum_index = forum_post_ids.indexOf(post_id);

                if (forum_index != -1) {
                    forum_post_ids.splice(forum_index, 1);
                }

                await User.findOneAndUpdate( {uid: user_id}, {postIds: user_post_ids} ); // Remove the post entry from User
                await Forum.findOneAndUpdate( {forumId: forum_id}, {postIds: forum_post_ids} ); // Remove the post entry from Forum
                await Post.deleteOne( {postId: post_id} ); // Remove the post entry from database.

                return res.status(200).json( {message: "Deleted a post successfuly"});
            }
            return res.status(403).json( {error: "Unauthorized" });

        } catch (error) {
            console.error("Error in deletePost:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async getRecentPosts(req, res) {
        const user_login = req.user.login;

        const user_asking = await User.findOne({login: user_login});

        if (!user_asking) {
            return res.status(404).json({error: "User wasn't found"});
        }

        const posts_to_return = [];

        if (!user_asking.followsIds) {
            return res.status(200).json({message: "No posts since you dont follow anybody"});
        }
        
        for (const subscriptionUid of user_asking.followsIds) {
            const current_user = await User.findOne({uid: subscriptionUid});

            if (current_user.postsIds.length < 3) {
                posts_to_return.push(...current_user.postsIds);
            }
            else {
                const sliced_posts = current_user.postsIds.slice(-3);
                posts_to_return.push(...sliced_posts);
            }
        }

        await res.status(200).json({ posts: posts_to_return });

    }
}

module.exports = postController;
