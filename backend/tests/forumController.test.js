const {createForum, joinForum, getForum, banUser, unbanUser} = require('../controllers/forumController');
const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
const Forum = require('../model/Forum.js')
const User = require('../model/User.js')
const app = require('../app');


// let server;

// Setup: Start the server before running tests
beforeAll((done) => {
    // Create and start the server
    server = http.createServer(app);
    server.listen(done);
});

// Teardown: Shutdown the server after running tests and mongoose connection
afterAll(() => {
    mongoose.disconnect();
    server.close();
});

describe('createForum', () => {
    test('return 201 & correct fields if forum is created correctly', async () => {
        const req = { body: {
            forumTitle: "Tanks",
            creatorId: 4 
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createForum(req, res);
        expect(res.status).toHaveBeenCalledWith(201);

        const forum = await Forum.findOne({forumTitle: "Tanks"})

        expect(forum.forumTitle).toEqual('Tanks');
        expect(forum.userIds).toEqual([4]);
        expect(forum.creatorId).toEqual(4);

    });

    test('return 400 when creating forum with existing name', async () => {
        const req = { body: {
            forumTitle: "Apples",
            creatorId: 2
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createForum(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('return 400 when creating forum with existing name', async () => {
        const req = { body: {
            forumTitle: "Apples",
            creatorId: 2
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createForum(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('return 400 when creating forum with existing name', async () => {
        const req = { body: {
            forumTitle: "Apples",
            creatorId: 2
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createForum(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('create a forum - 201 and join with real user – 201', async () => {
        
        const req1 = { body: {
            forumTitle: "Bubbles",
            creatorId: 3
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createForum(req1, res);
        expect(res.status).toHaveBeenCalledWith(201);

        var forum = await Forum.findOne({forumTitle: "Bubbles"});

        expect(forum).toBeTruthy();

        const req2 = { body: {
            forumId: forum.forumId,
            memberId: 2
        }};

        await joinForum(req2, res);

        expect(res.status).toHaveBeenCalledWith(201);
        
        forum = await Forum.findOne({forumTitle: "Bubbles"});
        const user = await User.findOne({uid: 3});

        expect(forum.userIds).toContain(3);
        expect(user.forumIds).toContain(forum.forumId);
    });

    test('404 -> get inexisting forum', async () => {
        
        const response = await request(app)
        .get('/forums/inexisting')
        .expect(404);

        expect(response.body.error).toEqual('Forum with such name does not exists');
    });
});

describe('(un)banUser', () => {
    test('return 200 for correct ban and unban of a user', async () => {
        const req = { body: {
            modId: 1,
            userId: 2,
            forumId: 1 
        }};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await banUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);

        const forum = await Forum.findOne({forumId: 1});
        const user = await User.findOne({uid: 2});

        expect(forum.bannedUserIds).toContain(2);
        expect(user.forumIds).not.toContain(1);

        const res1 = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await unbanUser(req, res1);

        expect(res1.status).toHaveBeenCalledWith(200);

        const forum1 = await Forum.findOne({forumId: 1});
        console.log(forum1.bannedUserIds)
        expect(forum1.bannedUserIds).not.toContain(2);
    });
});