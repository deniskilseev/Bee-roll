const { loginUser } = require('../controllers/userController');
const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')

let server;

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

describe('loginUser', () => {
    test('should return 200 if user is being logged in', async () => {
        const req = { body: {
            username: "dasdasdf",
            password: "123"
        } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});
