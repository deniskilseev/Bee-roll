const testDatabaseConnection = require('./testDatabaseConnection');
const User = require('../../model/User')
const Counter = require('../../model/Counter')
const Forum = require('../../model/Forum')
const Post = require('../../model/Post')
const WatchList = require('../../model/WatchList')
// const jest = require('jest');

module.exports = async () => {
    try {
        await testDatabaseConnection();
        // jest.setTimeout(10000);
        const counters = [
            {_id: "User", collectionCounter: 4},
            {_id: "Forum", collectionCounter: 3},
<<<<<<< HEAD
            {_id: "Post", collectionCounter: 6},
            {_id: "Comment", collectionCounter: 1}
=======
            {_id: "Post", collectionCounter: 5},
            {_id: "WatchList", collectionCounter: 5},
>>>>>>> d6244e212f65416d50e6905228f49296df7d6955
        ]

        const users = [
            {uid: 1, login: 'denis', password: '123', email: 'denis@gmail.com', followersIds: [3], postsIds: [1, 2], forumIds: [1], watctListsIds: [2],},
            {uid: 2, login: 'artemii', password: '321', email: 'artemii@gmail.com', followersIds: [3], postsIds: [3, 4], forumIds: [1], wathcListsIds: [1, 4, 5],},
            {uid: 3, login: 'aarna', password: 'qwerty', email: 'aarna@gmail.com', followsIds: [1, 2], postsIds: [5], watchListsIds: [3],},
            {uid: 4, login: 'sreekar', password: 'ytrewq', email: 'sreekar@gmail.com'}
        ];

        const posts = [
            {postId: 1, userId: 1, postTitle: "Mercedes", forumId: 2, postText: "Love mercedes."},
            {postId: 2, userId: 1, postTitle: "BMW", forumId: 2, postText: "Maybe love BMW."},
            {postId: 3, userId: 2, postTitle: "Big apples", forumId: 1, postText: "Hate big apples"},
            {postId: 4, userId: 2, postTitle: "Small apples", forumId: 1, postText: "Maybe hate small apples."},
            {postId: 5, userId: 3, postTitle: "PINEAPPLES", forumId: 3, postText: "Pineapples >> apples"},
            {postId: 6, userId: 4, postTitle: "Welcome", forumId: 4, postText: "Welcome to forum"},
        ];

        const forums = [
<<<<<<< HEAD
            {forumId: 1, forumTitle: 'Apples', creatorId: 1, userIds: [1, 2], postIds: [3, 4], isPrivate: false},
            {forumId: 2, forumTitle: 'Cars', creatorId: 2, userIds: [2], postIds: [1, 2], isPrivate: true},
            {forumId: 3, forumTitle: 'Pineapples', creatorId: 3, userIds: [3], postIds: [5], isPrivate: false},
            {forumId: 4, forumTitle: 'highboys', creatorId: 4, userIds: [4, 1], postIds: [6], isPrivate: true}
=======
            {forumId: 1, forumTitle: 'apples', creatorId: 1, userIds: [1, 2], postIds: [3, 4], isPrivate: false},
            {forumId: 2, forumTitle: 'cars', creatorId: 2, userIds: [2], postIds: [1, 2], isPrivate: true},
            {forumId: 3, forumTitle: 'pineapples', creatorId: 3, userIds: [3], postIds: [5], isPrivate: false}
        ];

        const watchlists = [
            {watchListId: 1, watchListTitle: "GMOAT", userId: 2, isPublic: false, movieIds: [1, 2, 3, 4]},
            {watchListId: 2, watchListTitle: "Comedies", userId: 1, isPublic: false, movieIds: [1, 2, 3]},
            {watchListId: 3, watchListTitle: "Drammas", userId: 3, isPublic: true, movieIds: [5, 6]},
            {watchListId: 4, watchListTitle: "Le funny", userId: 2, isPublic: false, movieIds: [7, 8]},
            {watchListId: 5, watchListTitle: "Le sad", userId: 2, isPublic: true, movieIds: [10, 11]},
>>>>>>> d6244e212f65416d50e6905228f49296df7d6955
        ];

        await User.insertMany(users);
        await Counter.insertMany(counters);
        await Forum.insertMany(forums);
        await Post.insertMany(posts);
        await WatchList.insertMany(watchlists);

    } catch (error) {
        console.error('Error populating fields in tests/framework/setup.js', error);
    }
};
