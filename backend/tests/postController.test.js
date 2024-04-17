const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
const User = require('../model/User')
const Forum = require('../model/Forum')
const Post = require('../model/Post')
const app = require('../app');


// let server;

// Setup: Start the server before running tests
beforeAll(async () => {
    // Create and start the server
    server = http.createServer(app);
    await new Promise(resolve => server.listen(resolve));

    const req = { body: {
        username: "aarna",
        password: "qwerty"
    }};

    try {
        const response = await request(app)
            .post('/users/loginUser')
            .send(req.body);

        token = 'Bee-roll ' + response.body.token;

        // done();
    } catch (error) {
        console.error("Before all error: ", error);
        // done.fail(error);
    }
});

// Teardown: Shutdown the server after running tests and mongoose connection
afterAll(() => {
    mongoose.disconnect();
    server.close();
});

describe('getRecentPosts', () => {
    test('should return 200 & correct post Ids', async () => {
        const res = await request(app)
        .post('/posts/getRecentPosts')
        .set({Authorization: token});
        
        const posts_ids = [1, 2, 3, 4];

        expect(res.status).toEqual(200);
        expect(res.body.posts).toEqual(posts_ids);
    });
});

describe('createPost', () => {
    test('should return 201 if we create a propper post', async() => {
        const req = { body: {
            forumId: 3,
            postTitle: "Pineapples.",
            postText: "Love Pineapples.",
            containsSpoilers: false
        }};
        
        const res = await request(app)
            .post('/posts/createPost')
            .send(req.body)
            .set({Authorization: token});
        

        expect(res.status).toBe(201);

        const forum_info = await Forum.findOne( {forumId: 3} );
        
        const user_info = await User.findOne( {login: "aarna"} );

        const post_info = await Post.findOne( {postTitle: "Pineapples."} );

        const post_id = post_info.postId;

        expect(forum_info.postIds).toContain(post_id);

        expect(user_info.postsIds).toContain(post_id);

        expect(post_info).not.toBeUndefined();
    });

    test('Creating a repost should also return 200', async () => {
        const req = { body: {
            forumId: 3,
            postTitle: "lel.",
            postText: "Really Funny",
            containsSpoilers: false,
            repostId: 7, 
        }};

        const res = await request(app)
            .post('/posts/createPost')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(201);

        const post_info = await Post.findOne( {postTitle: "lel."} );

        expect(post_info.repostId).toBe(7);
    });

    test('Creating a post on non-existent forum returns 400', async() => {
        const req = { body: {
            forumId: 1000000,
            postTitle: "Dogs.",
            postText: "I love dogs!",
            containsSpoilers: false
        }};

        const res = await request(app)
            .post('/posts/createPost')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('Invalid spoilers value returns 400', async() => {
        const req = { body: {
            forumId: 3,
            postTitle: "stuff, lol",
            postText: "more stuff",
            containsSpoilers: "Banana"
        }};

        const res = await request(app)
            .post('/posts/createPost')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);

    });
});

describe('pinPost', () => {
    test('pinning an existing post returns 200', async() => {
        req = { body: {
            forumId: 3,
            postId: 5
        }};

        const res = await request(app)
        .post('/posts/pinPost')
        .send(req.body)
        .set({Authorization: token});

        expect(res.status).toBe(200);

        const forum_info = await Forum.findOne( {forumId: 3} );

        expect(forum_info.pinnedPost).toBe(5); 

    });

    test('pinning a post if not an admin returns 403', async() => {
        req = { body: {
            forumId: 2,
            postId: 1
        }};

        const res = await request(app)
        .post('/posts/pinPost')
        .send(req.body)
        .set({Authorization: token});

        expect(res.status).toBe(403);
    });

    test('pinning a post from another forum returns 400', async() => {
        req = { body: {
            forumId: 3,
            postId: 2
        }};

        const res = await request(app)
        .post('/posts/pinPost')
        .send(req.body)
        .set({Authorization: token});

        expect(res.status).toBe(400);
    });
});

describe('getPostInfo', () => {
    test('Valid request returns all the post info', async() => {
        const res = await request(app)
        .get('/posts/getPost/1')
        .set({Authorization: token});

        expect(res.status).toBe(200);
    });

    test('Inexistent post returns 400', async() => {
        const res = await request(app)
        .get('/posts/getPost/10000')
        .set({Authorization: token});

        expect(res.status).toBe(400);

    });
});

describe('deletePost', () => {
    test('Valid request returns 200', async() => {
        const res = await request(app)
        .delete('/posts/deletePost/5')
        .set({Authorization: token});

        expect(res.status).toBe(200);

        const forum_info = await Forum.findOne( {forumId: 3} );
        
        const user_info = await User.findOne( {login: "aarna"} );

        expect(forum_info.postIds).not.toContain(5);

        expect(user_info.postsIds).toContain(5);
    });

    test('Trying to delete post as not admin 403', async() => {
        const res = await request(app)
        .delete('/posts/deletePost/2')
        .set({Authorization: token});

        expect(res.status).toBe(403);
 
    });
});

describe('Violating TOS', () => {
    test('Valid request returns 200', async () => {
        const req = { body :{
            postId: 8
        }};
        const res = await request(app)
            .post('/posts/toggleViolate')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const post_info = await Post.findOne( {postId: req.body.postId} );

        expect(post_info.isViolating).toBe(true);
    });

    test('Inexistent post id returns 400', async () => {
        const req = { body :{
            postId: 1000000
        }};
        const res = await request(app)
            .post('/posts/toggleViolate')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('Not a mod returns 403', async () => {
        const req = { body :{
            postId: 4
        }};
        const res = await request(app)
            .post('/posts/toggleViolate')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });

});
