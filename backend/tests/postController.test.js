const {getRecentPosts} = require('../controllers/postController');
const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
const User = require('../model/User.js')


// let server;

// Setup: Start the server before running tests
beforeAll((done) => {
    // Create and start the server
    const app = require('../app');
    server = http.createServer(app);
    server.listen(done);
});

// Teardown: Shutdown the server after running tests and mongoose connection
afterAll(() => {
    mongoose.disconnect();
    server.close();
});

describe('getRecentPosts', () => {
    test('should return 200 & correct post Ids', async () => {

        const req = { body: {
            user_login: "aarna"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getRecentPosts(req, res);
        
        const posts_ids = [1, 2, 3, 4];

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({posts: posts_ids});
    });
});