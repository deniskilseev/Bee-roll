const { loginUser, createUser } = require('../controllers/userController');
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

describe('loginUser', () => {
    test('should return 200 if user is being logged in', async () => {

        const req = { body: {
            username: "denis",
            password: "123"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
    test('should return 401 if user provides wrong credentials', async () => {

        const req = { body: {
            username: "denis",
            password: "321"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });
});

describe('createUser', () => {
    test('return 201 if creating user that doesnt exist', async () => {

        const req = { body: {
            username: "newuser",
            password: "123",
            email: "newuser@gmail.com"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        const user = await User.findOne({login: "newuser"});

        expect(user).toBeTruthy();
    });

    test('return 201 for creating new user and 200 for logging them in', async () => {

        var req = { body: {
            username: "new",
            password: "password",
            email: "abc_user@gmail.com"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        req = { body: {
            username: "new",
            password: "password"
        }};

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('return 400 if creating user with existing email', async () => {

        const req = { body: {
            username: "newuser1",
            password: "321",
            email: "denis@gmail.com"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('return 400 if creating user with existing username', async () => {

        const req = { body: {
            username: "denis",
            password: "321",
            email: "denis@gmail.com"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});