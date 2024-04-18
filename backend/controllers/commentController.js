const mongoose = require('mongoose')
const express = require('express')
const User = require('../model/User.js')
const Post = require('../model/Post.js')
const Forum = require('../model/Forum.js')
const Counter = require('../model/Counter.js')
const Comment = require('../model/Comment.js')


const commentController = {
    async createComment(req, res) {
        try {
            const {commentText, postingDate, postId} = req.body;
            const user_login = req.user.login;

            const user = await User.findOne({login: user_login});
            const user_uid = user.uid;

            const post = await Post.findOne({postId: postId});

            if (!post) {
                return res.status(404).json({error: "Post not found!"});
            }

            const forum = await Forum.findOne({forumId: post.forumId});

            if (forum.isPrivate && !forum.userIds.includes(user_uid)) {
                return res.status(404).json({error: "Post not found!"});
            }

            const counter = await Counter.findOne({_id: "Comment"});
            const commentId = counter.collectionCounter + 1;

            const newComment = new Comment({
                userId: user_uid,
                commentId: commentId,
                postId: postId,
                commentText: commentText,
                postingDate: Date.now()
            });

            post.commentIds.push(commentId);
            user.commentIds.push(commentId);
            counter.collectionCounter = commentId;

            await newComment.save();
            await post.save();
            await user.save();
            await counter.save();

            return res.status(200).json({message: "Comment created succesfully.", comment: newComment})
        } catch (error) {
            console.error("Error in createComment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async deleteComment(req, res) {
        try {
            const {commentId} = req.body;
            const user_login = req.user.login;

            const user_deleting = await User.findOne({login: user_login});
            const user_deleting_uid = user_deleting.uid;

            const comment = await Comment.findOne({commentId: commentId});

            if (!comment) {
                return res.status(404).json({error: "Comment not found!"});
            }

            const user_comment = await User.findOne({uid: comment.userId});

            const post = await Post.findOne({postId: comment.postId});
            const forum = await Forum.findOne({forumId: post.forumId});
            console.log("USER CREATING: ", post.userId)
            const isAllowed = user_deleting_uid == post.userId 
                || user_deleting_uid == forum.creatorId 
                || forum.moderatorIds.includes(user_deleting_uid);
            if (!isAllowed) {
                return res.status(403).json({error: "You have no rights"});
            }

            await Comment.findOneAndDelete({commentId: commentId});

            post.commentIds.pull(commentId);
            user_comment.commentIds.pull(commentId);

            await post.save();
            await user_comment.save();

            return res.status(200).json({message: "Comment deleted succesfully."})
        } catch (error) {
            console.error("Error in createComment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async getComment(req, res) {
        try {
            const commentId = req.params.commentId;

            const comment = await Comment.findOne({commentId: commentId});

            if (!comment) {
                return res.status(404).json({error: "No comment found"});
            }
    
            return res.status(200).json({comment});
        }
        catch (error) {
            console.error("Error in getComment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    async upvoteComment(req, res) {
        try {
            const commentId = req.params.comment_id;

            const user_upvoting = await User.findOne({login: req.user.login});
    
            if (!user_upvoting) {
                return res.status(404).json({error: "User wasn't found"});
            }
    
            const comment = await Comment.findOne({commentId: commentId});
    
            if (!comment) {
                return res.status(404).json({error: "Comment wasn't found"});
            }
    
            if (user_upvoting.upvotedComments.includes(commentId)) {
                return res.status(400).json({error: "Can't upvote twice"});
            }
    
            comment.rating += 1;
    
            if (user_upvoting.downvotedComments.includes(commentId)) {
                comment.rating += 1;
                user_upvoting.downvotedComments.pull(commentId);
            }

            user_upvoting.upvotedComments.push(commentId);
            
            await comment.save();
            await user_upvoting.save();

            return res.status(200).json({message: "Comment upvoted succesfully"});
        } catch (error) {
            console.error("Error in upvoteComment:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },

    async downvoteComment(req, res) {
        try {
            const commentId = req.params.comment_id;

            const user_downvoting = await User.findOne({login: req.user.login});
    
            if (!user_downvoting) {
                return res.status(404).json({error: "User wasn't found"});
            }
    
            const comment = await Comment.findOne({commentId: commentId});
    
            if (!comment) {
                return res.status(404).json({error: "Comment wasn't found"});
            }
    
            if (user_downvoting.downvotedComments.includes(commentId)) {
                return res.status(400).json({error: "Can't downvote twice"});
            }
    
            comment.rating -= 1;
    
            if (user_downvoting.upvotedComments.includes(commentId)) {
                comment.rating -= 1;
                user_downvoting.upvotedComments.pull(commentId);
            }

            user_downvoting.downvotedComments.push(commentId);

            await comment.save();
            await user_downvoting.save();

            return res.status(200).json({message: "Comment upvoted succesfully"});
        } catch (error) {
            console.error("Error in downvoteComment:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },
 
    async revokeVote(req, res) {
        try {
            const commentId = req.params.comment_id;

            const user = await User.findOne({login: req.user.login});
    
            if (!user) {
                return res.status(404).json({error: "User wasn't found"});
            }
    
            const comment = await Comment.findOne({commentId: commentId});
    
            if (!commentId) {
                return res.status(404).json({error: "Comment wasn't found"});
            }

            if (!user.downvotedComments.includes(commentId) && !user.upvotedComments.includes(commentId)) {
                return res.status(400).json({error: "cant revoke a vote without a vote"});
            }

            if (user.downvotedComments.includes(commentId)) {
                user.downvotedComments.pull(commentId);
                comment.rating += 1;
            }
            else if (user.upvotedComments.includes(commentId)) {
                user.upvotedComments.pull(commentId);
                comment.rating -= 1;
            }

            await comment.save();
            await user.save();

            return res.status(200).json({message: "Comment vote revoked succesfully"});
        } catch (error) {
            console.error("Error in revokeVote:", error);
            return res.status(500).json( {error: "Internal server error"} );
        }
    },
}

module.exports = commentController;
