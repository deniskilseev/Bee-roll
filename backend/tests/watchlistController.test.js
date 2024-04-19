const http = require('http');
const request = require('supertest'); // Supertest is a library for testing HTTP servers
const mongoose = require('mongoose');
const User = require('../model/User.js');
const WatchList = require('../model/WatchList');
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

describe('createWatchList', () => {
    test('201 when all of the parameter are correct', async () => {
        const req = { body: {
            isPublic: true,
            watchlistTitle: "Thriller",
        }};

        const res = await request(app)
            .post('/watchlists/createWatchList')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(201);

        const watchlist = await WatchList.findOne({watchListTitle: "Thriller"})

        expect(watchlist.watchListTitle).toEqual('Thriller');
        expect(watchlist.userId).toEqual(2);
    });

    test('400 when the watchlist is already created', async () => {
        const req = { body: {
            isPublic: true,
            watchlistTitle: "GMOAT"
        }};

        const res = await request(app)
            .post('/watchlists/createWatchlist')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);

    });

    test('400 when the isPublic is non-boolean', async () => {
        const req = { body: {
            isPublic: 10,
            watchlistTitle: "Musicals"
        }};

        const res = await request(app)
            .post('/watchlists/createWatchlist')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);

    });
});

describe('getWatchList', () => {
    test('200 when data is correct', async () => {
        const res = await request(app)
            .get('/watchlists/getWatchlist/3')
            .set({Authorization: token});

        expect(res.status).toBe(200);
    });

    test('200 when following the watchlist is private and not the owner', async () => {
        const res = await request(app)
            .get('/watchlists/getWatchlist/2')
            .set({Authorization: token});

        expect(res.status).toBe(200);
    });

    test('403 when not following the watchlist and is private', async () => {
        const res = await request(app)
            .get('/watchlists/getWatchlist/7')
            .set({Authorization: token});

        expect(res.status).toBe(403);

    });

    test('200 when the watchlist is private and the owner', async () => {
        const res = await request(app)
            .get('/watchlists/getWatchlist/1')
            .set({Authorization: token});

        expect(res.status).toBe(200);
    });

    test('400 when the watchlist does not exist', async () => {
        const res = await request(app)
            .get('/watchlists/getWatchlist/100000')
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

});

describe('addMovie', () => {
    test('200 when all the data is correct', async () => {
        const req = { body : {
            watchlistId: 1,
            movieId: 5,
        }};

        const res = await request(app)
            .post('/watchlists/addMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const watchlist_info = await WatchList.findOne({watchListId: 1});

        expect(watchlist_info.movieIds).toContain(5);
    });

    test('403 when not the creator', async () => {
        const req = { body : {
            watchlistId: 2,
            movieId: 5,
        }};

        const res = await request(app)
            .post('/watchlists/addMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });

    test('400 when the watchlist does not exist', async () => {
        const req = { body : {
            watchlistId: 100000,
            movieId: 5,
        }};

        const res = await request(app)
            .post('/watchlists/addMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('400 when the movie does not exist', async () => {
        const req = { body : {
            watchlistId: 1,
            movieId: 100000,
        }};

        const res = await request(app)
            .post('/watchlists/addMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });
});

describe ('deleteMovie', () => {
    test('200 when the data is correct', async () => {
        req = { body : {
            watchlistId: 1,
            movieId: 3,
        }};

        const res = await request(app)
            .post('/watchlists/removeMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const watchlist_data = await WatchList.findOne({watchListId: 1});

        expect(watchlist_data.movieIds).not.toContain(3);
    });

    test('403 when not the owner', async () => {
        req = { body : {
            watchlistId: 2,
            movieId: 1,
        }};

        const res = await request(app)
            .post('/watchlists/removeMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });

    test('400 when no watchlist exists', async () => {
        req = { body : {
            watchlistId: 100000,
            movieId: 1,
        }};

        const res = await request(app)
            .post('/watchlists/removeMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });

    test('400 when no movie exists', async () => {
        req = { body : {
            watchlistId: 1,
            movieId: 100000,
        }};

        const res = await request(app)
            .post('/watchlists/removeMovie')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });
});

describe('deleteWatchlist', () => {
    test('200 when data is correct', async () => {
        const res = await request(app)
            .delete('/watchlists/deleteWatchlist/4')
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const watchlist_data = await WatchList.findOne({watchListId: 4});
        const user_data = await User.findOne({uid: 2});

        expect(watchlist_data).not.toBeTruthy(); 
        expect(user_data.watchListsIds).not.toContain(4);
    });

    test('403 when not the creator', async () => {
        const res = await request(app)
            .delete('/watchlists/deleteWatchlist/2')
            .set({Authorization: token});

        expect(res.status).toBe(403);

    });

     test('400 when does not exist', async () => {
        const res = await request(app)
            .delete('/watchlists/deleteWatchlist/100000')
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });
});

describe('togglePublic', () => {
    test('200 when all correct', async () => {
         req = { body : {
            watchlistId: 5,
        }};

        const res = await request(app)
            .post('/watchlists/togglePublic')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const watchlist_data = await WatchList.findOne({watchListId: 5});

        expect(watchlist_data.isPublic).toBe(false);

    });

    test('403 when not the creator', async () => {
         req = { body : {
            watchlistId: 2,
        }};

        const res = await request(app)
            .post('/watchlists/togglePublic')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });

    test('400 when no watchlist exist', async () => {
         req = { body : {
            watchlistId: 100000,
        }};

        const res = await request(app)
            .post('/watchlists/togglePublic')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(400);
    });
});

describe('follow a watchlist', () => {
    test('200 when everything is correct', async () => {
        req = { body : {
            watchlistId: 6,
        }};

        const res = await request(app)
            .post('/watchlists/followWatchlist')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const user_data = await User.findOne({login: "artemii"});

        const watchlist_data = await WatchList.findOne({watchListId: 6});

        expect(user_data.followedWatchListsIds).toContain(6);
        expect(watchlist_data.followerIds).toContain(user_data.uid);
    });

    test('403 when the watchlist is private', async () => {
        req = { body: {
            watchlistId: 7,
        }};

        const res = await request(app)
            .post('/watchlists/followWatchlist')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(403);
    });
});

describe('unfollowWatchlist', () => {
    test('200 when everything is correct', async () => {
        req = { body: {
            watchlistId: 3,
        }};

         const res = await request(app)
            .post('/watchlists/unfollowWatchlist')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const user_data = await User.findOne({login: "artemii"});

        const watchlist_data = await WatchList.findOne({watchListId: 3});

        expect(user_data.followedWatchListsIds).not.toContain(3);
        expect(watchlist_data.followerIds).not.toContain(user_data.uid);
    });

    test('200 when the watchlist is private', async () => {
        req = { body: {
            watchlistId: 2,
        }};

         const res = await request(app)
            .post('/watchlists/unfollowWatchlist')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const user_data = await User.findOne({login: "artemii"});

        const watchlist_data = await WatchList.findOne({watchListId: 2});

        expect(user_data.followedWatchListsIds).not.toContain(2);
        expect(watchlist_data.followerIds).not.toContain(user_data.uid);

    });
});

describe('Change Title', () => {
    test('200 when everythin is correct', async () => {
        req = { body: {
            watchlistId: 1,
            newTitle: "sick movies, lol"
        }};

         const res = await request(app)
            .put('/watchlists/changeTitle')
            .send(req.body)
            .set({Authorization: token});

        expect(res.status).toBe(200);

        const watchlist_data = await WatchList.findOne({watchListId: 1});

        expect(watchlist_data.watchListTitle).toBe(req.body.newTitle);

    }); 
});
