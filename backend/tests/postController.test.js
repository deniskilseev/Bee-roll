const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
const User = require('../model/User.js')
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