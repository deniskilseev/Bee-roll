const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
const Comment = require('../model/Comment')
const Post = require('../model/Post')
const User = require('../model/User')
const Forum = require('../model/Forum')

const app = require('../app');

let token; // Token for authentification

// Setup: Start the server before running tests
beforeAll(async () => {
    // Create and start the server
    server = http.createServer(app);
    await new Promise(resolve => server.listen(resolve));

    const req = { body: {
        username: "denis",
        password: "123"
    }};

    try {
        const response = await request(app)
            .post('/users/loginUser')
            .send(req.body);

        token = 'Bee-roll ' + response.body.token;
    } catch (error) {
        console.error("Before all error: ", error);
    }
});

// Teardown: Shutdown the server after running tests and mongoose connection
afterAll(() => {
    mongoose.disconnect();
    server.close();
});

describe('createComment', () => {
    test('return 200 on success', async () => {
        const req = { body: {
            commentText: "You suck lol",
            postId: 3
        }};

        const res = await request(app)
            .post('/comments/createComment')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toEqual(200);

        const comment = await Comment.findOne({commentText: "You suck lol"});
        const post = await Post.findOne({postId: req.body.postId});
        const user = await User.findOne({login: 'denis'});
        expect(comment).toBeTruthy();
        expect(post.commentIds).toContain(comment.commentId);
        expect(user.commentIds).toContain(comment.commentId);
    });
    test('return 404 for private forums', async () => {
        const req = { body: {
            commentText: "You suck",
            postId: 7
        }};

        const res = await request(app)
            .post('/comments/createComment')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toEqual(404);
    });
    test('return 404 on inexisting post', async () => {
        const req = { body: {
            commentText: "You lol",
            postId: -1 
        }};

        const res = await request(app)
            .post('/comments/createComment')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toEqual(404);
    });

    test('return 200 on private forum with a member', async () => {
        const req = { body: {
            commentText: "hi there",
            postId: 6
        }};

        const res = await request(app)
            .post('/comments/createComment')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toEqual(200);
        const comment = await Comment.findOne({commentText: "hi there"});
        expect(comment).toBeTruthy();
    });
});

describe('deleteComment', () => {
    test('return 200 on success', async () => {
        const req = { body: {
            commentId: 2
        }};

        const comment = await Comment.findOne({commentId: req.body.commentId});

        const res = await request(app)
            .delete('/comments/deleteComment')
            .send(req.body)
            .set({Authorization: token});
        
        const comments = await Comment.find();
        console.log(comments);

            
        expect(res.status).toEqual(200);

        const post = await Post.findOne({postId: comment.postId});
        const user = await User.findOne({login: 'denis'});

        expect(post.commentIds).not.toContain(req.body.commentId);
        expect(user.commentIds).not.toContain(req.body.commentId);
    });
    test('return 404 on inexisting comment', async () => {
        const req = { body: {
            commentId: -1
        }};

        const comment = await Comment.findOne({commentId: req.body.commentId});

        const res = await request(app)
            .delete('/comments/deleteComment')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toEqual(404);
    });
});