const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose')
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

describe('loginUser', () => {
    test('should return 200 if user is being logged in', async () => {

        const req = { body: {
            username: "denis",
            password: "123"
        }};

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"})

        const token = response.body.token;

        expect(response.status).toEqual(200);
    });
    test('should return 401 if user provides wrong credentials', async () => {

        const response2 = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "321"});

        expect(response2.status).toEqual(401);
    });
});

describe('createUser', () => {
    test('return 201 if creating user that doesnt exist', async () => {

        const response = await request(app)
            .post('/users/createUser')
            .send({username: "newuser", password: "123", email: "newuser@gmail.com"});

        expect(response.status).toEqual(201);

        const user = await User.findOne({login: "newuser"});

        expect(user).toBeTruthy();
    });

    test('return 201 for creating new user and 200 for logging them in', async () => {

        var req = { body: {
            username: "new",
            password: "password",
            email: "abc_user@gmail.com"
        }};

        const response = await request(app)
            .post('/users/createUser')
            .send(req.body);

        expect(response.status).toEqual(201);

        const response_login = await request(app)
            .post('/users/loginUser')
            .send({username: "new", password: "password"});

        expect(response_login.status).toEqual(200);
    });

    test('return 400 if creating user with existing email', async () => {

        const req = { body: {
            username: "newuser1",
            password: "321",
            email: "denis@gmail.com"
        }};

        const response = await request(app)
            .post('/users/createUser')
            .send(req.body);

        expect(response.status).toEqual(400);
    });

    test('return 400 if creating user with existing username', async () => {

        const req = { body: {
            username: "denis",
            password: "321",
            email: "denis@gmail.com"
        }};

        const response = await request(app)
            .post('/users/createUser')
            .send(req.body);

        expect(response.status).toEqual(400);
    });
});

describe('putUser', () => {
    test('return 200 if updating user that exists', async () => {

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"})

        const token = response.body.token;

        const req2 = { body: {
            username: "denis",
            password: "123",
            email: "i_am_great@gmail.com"
        }};

        const res = await request(app)
            .put('/users/putUser')
            .send(req2.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res.status).toBe(200);

        const user = await User.findOne({login: "denis"});

        expect(user.email).toEqual("i_am_great@gmail.com");
        expect(user.password).toEqual("123");
    });

    test('return 400 if updating user with email that is registered', async () => {

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"})

        const token = response.body.token;
        
        console.log("Second case: " + response.status);

        const req = { body: {
            username: "denis",
            password: "321",
            email: "sreekar@gmail.com"
        }};

        const res = await request(app)
            .put('/users/putUser')
            .send(req.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res.status).toBe(400);
    });
});

describe('(un)followUser', () => {
    test('return 200 if following is successful', async () => {

        const login = { body: {
            username: "denis",
            password: "123"
        }};
            
        const response = await request(app)
            .post('/users/loginUser')
            .send(login.body);

        const token = response.body.token;

        const req = { body: {
            user_followed: "sreekar"
        }};

        const res = await request(app)
            .post('/users/followUser')
            .send(req.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res.status).toEqual(200);

        const user1 = await User.findOne({login: "denis"});
        const user2 = await User.findOne({login: "sreekar"});

        expect(user1.followsIds).toContain(user2.uid);
        expect(user2.followersIds).toContain(user1.uid);
    });
    test('return 404 if person followed is inexistent', async () => {

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"})

        const token = response.body.token;

        expect(response.status).toEqual(200);

        const req = { body: {
            user_followed: "inexistent"
        }};

        const res = await request(app)
            .post('/users/followUser')
            .send(req.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res.status).toEqual(404);
    }); 

    test('return 200 if following is successful then 200 if unfollowing', async () => {

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"})

        const token = response.body.token;

        expect(response.status).toEqual(200);
        
        const req = { body: {
            user_followed: "sreekar"
        }};

        const res = await request(app)
            .post('/users/followUser')
            .send(req.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res.status).toEqual(200);

        const user1 = await User.findOne({login: "denis"});
        const user2 = await User.findOne({login: "sreekar"});

        expect(user1.followsIds).toContain(user2.uid);
        expect(user2.followersIds).toContain(user1.uid);

        const res1 = await request(app)
            .post('/users/unfollowUser')
            .send(req.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res1.status).toEqual(200);

        const user11 = await User.findOne({login: "denis"});
        const user22 = await User.findOne({login: "sreekar"});

        expect(user11.followsIds).not.toContain(user22.uid);
        expect(user22.followersIds).not.toContain(user11.uid);
    });

    test('return 404 if one of users inexistent', async () => {

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"})

        const token = response.body.token;

        expect(response.status).toEqual(200);

        const req = { body: {
            user_followed: "inexistent"
        }};

        const res1 = await request(app)
            .post('/users/followUser')
            .send(req.body)
            .set({Authorization: 'Bee-roll ' + token});

        expect(res1.status).toEqual(404);
    });
});

describe('getUser(byId/byLogin)', () => {
    test('return 200 if getting correct user is successful', async () => {
        
        const uid = 1;

        const res = await request(app)
            .get('/users/getUser/' + uid);
        
        const user_info = res.body.user_info;

        expect(res.status).toEqual(200);
        const user = await User.findOne({uid: 1});

        expect(user.login).toEqual(user_info.login);
        expect(user.date_of_birth).toEqual(user_info.date_of_birth);
        expect(user.followsIds).toEqual(user_info.followsIds);
    });
    test('return 404 if user does not exist', async () => {
        
        const uid = 0;

        const res = await request(app)
            .get('/users/getUser/' + 0);

        expect(res.status).toEqual(404);
    });
    test('return 200 if getting correct user is successful', async () => {
        
        const username = 'denis';

        const res = await request(app)
            .get('/users/getUserByUsername/' + username);
        
        const user_info = res.body.user_info;

        expect(res.status).toEqual(200);
        const user = await User.findOne({login: username});

        expect(user.login).toEqual(user_info.login);
        expect(user.date_of_birth).toEqual(user_info.date_of_birth);
        expect(user.followsIds).toEqual(user_info.followsIds);
    });
    test('return 404 if user does not exist', async () => {
        
        const username = 'baba';

        const res = await request(app)
            .get('/users/getUserByUsername/' + username);

        expect(res.status).toEqual(404);
    });
});

describe('getUserByToken', () => {
    test('should return correct user data on correct token', async() => {
        const res1 = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"});

        const token = 'Bee-roll ' + res1.body.token;

        const res2 = await request(app)
            .get('/users/getSelf')
            .set({Authorization: token});

        expect(res2.status).toBe(200);
        expect(res2.body.data_by_username.uid).toBe(1);
        expect(res2.body.data_by_username.password).toBe(undefined);
    });

    test('Incorrect token should return 500', async () => {
        const token = "Bee-roll ASLDFMASLDFMASDLM"

        const res = await request(app)
            .get('/users/getSelf')
            .set({Authorization: token});

        expect(res.status).toBe(500);
    });
});

describe('uploadUserImage', () => {
    test('should upload a profile picture', async () => {

        const filePath = 'uploads/image.jpg';    

        const response = await request(app)
            .post('/users/loginUser')
            .send({username: "denis", password: "123"});

        const token = response.body.token;

        const res = await request(app)
            .post('/users/uploadProfilePicture')
            .attach('profile-picture', filePath)
            .set({Authorization: 'Bee-roll ' + token});

        const user = await User.findOne({login: 'denis'});

        expect(res.statusCode).toEqual(200);
        expect(user.profilePicture).toBeTruthy();
    });
    test('200 when requesting existing image', async () => {

        const res = await request(app)
            .get('/users/getProfilePicture/denis');

        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toEqual('image/jpeg');
    });
  }, 20 * 1000);
