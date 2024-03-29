const { loginUser, createUser, putUser, followUser, unfollowUser} = require('../controllers/userController');
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

// describe('putUser', () => {
//     test('return 200 if updating user that exists', async () => {

//         const req = { body: {
//             username: "denis",
//             password: "321",
//             email: "i_am_great@gmail.com"
//         }};

//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await putUser(req, res);

//         expect(res.status).toHaveBeenCalledWith(200);

//         const user = await User.findOne({login: "denis"});

//         expect(user.email).toEqual("i_am_great@gmail.com");
//         expect(user.password).toEqual("321");
//     });

//     test('return 404 if updating user that doesnt exists', async () => {

//         const req = { body: {
//             username: "oleg",
//             password: "321",
//             email: "i_am_great@gmail.com"
//         }};

//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await putUser(req, res);

//         expect(res.status).toHaveBeenCalledWith(404);
//     });

//     test('return 400 if updating user with email that is registered', async () => {

//         const req = { body: {
//             username: "denis",
//             password: "321",
//             email: "sreekar@gmail.com"
//         }};

//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         await putUser(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//     });
// });

describe('(un)followUser', () => {
    test('return 200 if following is successful', async () => {

        const req = { body: {
            user_follower: "denis",
            user_followed: "sreekar"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const user1 = await User.findOne({login: "denis"});
        const user2 = await User.findOne({login: "sreekar"});

        expect(user1.followsIds).toContain(user2.uid);
        expect(user2.followersIds).toContain(user1.uid);
    });
    test('return 404 if follower is inexistent', async () => {

        const req = { body: {
            user_follower: "inexistent",
            user_followed: "sreekar"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    }); 
    test('return 404 if person followed is inexistent', async () => {

        const req = { body: {
            user_follower: "inexistent",
            user_followed: "sreekar"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    }); 

    test('return 200 if following is successful then 200 if unfollowing', async () => {

        const req = { body: {
            user_follower: "denis",
            user_followed: "sreekar"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const user1 = await User.findOne({login: "denis"});
        const user2 = await User.findOne({login: "sreekar"});

        expect(user1.followsIds).toContain(user2.uid);
        expect(user2.followersIds).toContain(user1.uid);

        await unfollowUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const user11 = await User.findOne({login: "denis"});
        const user22 = await User.findOne({login: "sreekar"});

        expect(user11.followsIds).not.toContain(user22.uid);
        expect(user22.followersIds).not.toContain(user11.uid);
    });

    test('return 404 if one of users inexistent', async () => {

        const req = { body: {
            user_follower: "inexistent",
            user_followed: "sreekar"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('return 200 if users do not follow each other', async () => {

        const req = { body: {
            user_follower: "aarna",
            user_followed: "artemii"
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});