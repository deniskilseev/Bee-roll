const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
const Forum = require('../model/Forum.js')
const User = require('../model/User.js')
const app = require('../app');


// let server;
let token;

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

describe('createForum', () => {
    test('return 201 & correct fields if forum is created correctly', async () => {
        const req = { body: {
            forumTitle: "tanks"
        }};

        const res = await request(app)
            .post('/forums/createForum')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(201);

        const forum = await Forum.findOne({forumTitle: "tanks"})

        expect(forum.forumTitle).toEqual('tanks');
        expect(forum.userIds).toEqual([1]);
        expect(forum.creatorId).toEqual(1);

    });

    test('return 400 when creating forum with existing name', async () => {
        const req = { body: {
            forumTitle: "apples",
        }};

        const res = await request(app)
            .post('/forums/createForum')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('join a forum with real user – 201', async () => {

        var forum = await Forum.findOne({forumTitle: "cars"});

        expect(forum).toBeTruthy();

        const req = { body: {
            forumId: forum.forumId
        }};

        const res = await request(app)
            .post('/forums/joinForum')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(201);

        forum = await Forum.findOne({forumTitle: "cars"});
        const user = await User.findOne({login: "denis"});

        expect(forum.userIds).toContain(user.uid);
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
            userId: 2,
            forumId: 1 
        }};

        const res = await request(app)
            .post('/forums/banUser')
            .send(req.body)
            .set({Authorization: token});


        expect(res.status).toBe(200);

        const forum = await Forum.findOne({forumId: 1});
        const user = await User.findOne({uid: 2});

        expect(forum.bannedUserIds).toContain(2);
        expect(user.forumIds).not.toContain(1);

        const res1 = await request(app)
            .post('/forums/unbanUser')
            .send(req.body)
            .set({Authorization: token});

        expect(res1.status).toBe(200);

        const forum1 = await Forum.findOne({forumId: 1});
        expect(forum1.bannedUserIds).not.toContain(2);
    });
});

describe('(un)banUser', () => {
    test('return 200 for correct ban and unban of a user', async () => {
        const req = { body: {
            userId: 2,
            forumId: 1 
        }};

        const res = await request(app)
            .post('/forums/banUser')
            .send(req.body)
            .set({Authorization: token});


        expect(res.status).toBe(200);

        const forum = await Forum.findOne({forumId: 1});
        const user = await User.findOne({uid: 2});

        expect(forum.bannedUserIds).toContain(2);
        expect(user.forumIds).not.toContain(1);

        const res1 = await request(app)
            .post('/forums/unbanUser')
            .send(req.body)
            .set({Authorization: token});

        expect(res1.status).toBe(200);

        const forum1 = await Forum.findOne({forumId: 1});
        expect(forum1.moderatorIds).not.toContain(2);
        expect(forum1.bannedUserIds).not.toContain(2);
    });
});

describe('add/removeModerator', () => {
    test('return 200 for correct add and remove moderator', async () => {
        const req = { body: {
            userId: 2,
            forumId: 1
        }};

        const res = await request(app)
            .post('/forums/addModerator')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const forum = await Forum.findOne({forumId: 1});

        expect(forum.moderatorIds).toContain(2);

        const res1 = await request(app)
            .post('/forums/removeModerator');
    });
    test('return 403 for Unauthorized', async () => {
        const req = { body: {
            userId: 2,
            forumId: 2
        }};

        const res = await request(app)
            .post('/forums/addModerator')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });
});

describe('getAllForums', () => {
    test('return 200 with correct forums', async () => {
        const req = { body: {
            userId: 2,
            forumId: 1 
        }};

        const res = await request(app)
            .get('/forums/');

        const forums = res.body.publicForums;

        expect(forums.length).toEqual(3);
    });
});


describe('togglePrivate', () => {
    test('200 for correctly toggling private', async () => {

        const req = { body: {
            forumId: 1
        }};

         const res = await request(app)
            .post('/forums/togglePrivate')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const forum = await Forum.findOne({forumId: 1});

        expect(forum.isPrivate).toBe(true);
    });

    test('403 when unauthorized', async () => {
        const req = { body: {
            forumId: 2
        }};

         const res = await request(app)
            .post('/forums/togglePrivate')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });

     test('400 when the forum is inexisting', async () => {
        const req = { body: {
            forumId: 6
        }};

         const res = await request(app)
            .post('/forums/togglePrivate')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });
});

describe('changeTitle', () => {

    test('200 when title is valid', async () => {
        const req = { body: {
            forumId: 1,
            forumTitle: "books"
        }};

        const res = await request(app)
            .put('/forums/changeTitle')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const forum_info = await Forum.findOne({forumId: 1});

        expect(forum_info.forumTitle).toBe("books");
    });

    test('400 when the title is not valid', async () => {
        const req = { body: {
            forumId: 1,
            forumTitle: "BOOKS ARE THE BEST!"
        }};

        const res = await request(app)
            .put('/forums/changeTitle')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('400 when the forum is inexisting', async () => {
        const req = { body: {
            forumId: 1000,
            forumTitle: "books",
        }};

        const res = await request(app)
            .put('/forums/changeTitle')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('403 when the unauthorized', async () => {
         const req = { body: {
            forumId: 3,
            forumTitle: "guitars",
        }};

        const res = await request(app)
            .put('/forums/changeTitle')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });

}); 
