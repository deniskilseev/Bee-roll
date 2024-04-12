const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose');
const Review = require('../model/Review');
const app = require('../app');


// let server;
let token;

// Setup: Start the server before running tests
beforeAll(async () => {
    // Create and start the server
    server = http.createServer(app);
    await new Promise(resolve => server.listen(resolve));

    const req = { body: {
        username: "artemii",
        password: "321"
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

describe('getReviews', () => {
    test('200 when everythin is correct', async () => {
        const res = await request(app)
            .get('/reviews/getReviews')
            .set({Authorization: token});

        expect(res.status).toBe(200);

        expect(res.body.reviews.length).toBe(2);
    });
});

describe('averageRating', () => {
    test('2 reviews', async () => {
        const res = await request(app)
            .get('/reviews/getAverage/3');

        expect(res.status).toBe(200);
        expect(res.body.average).toBe(4.5);
    });

    test('1 review', async () => {
        const res = await request(app)
            .get('/reviews/getAverage/1');

        expect(res.status).toBe(200);
        expect(res.body.average).toBe(1);
    });

     test('0 reviews', async () => {
        const res = await request(app)
            .get('/reviews/getAverage/2');

        expect(res.status).toBe(200);
        expect(res.body.average).toBe(-1);
    });

     test('inexistent movie', async () => {
        const res = await request(app)
            .get('/reviews/getAverage/10000000');

        expect(res.status).toBe(400);
    });
});
