const testDatabaseConnection = require('./testDatabaseConnection');
const User = require('../../model/User')
const Counter = require('../../model/Counter')
const Forum = require('../../model/Forum')
const Post = require('../../model/Post')
// const jest = require('jest');


module.exports = async () => {
    try {
        await testDatabaseConnection();
        // jest.setTimeout(10000);
        const counters = [
            {_id: "User", collectionCounter: 4},
            {_id: "Forum", collectionCounter: 3},
            {_id: "Post", collectionCounter: 6},
            {_id: "Comment", collectionCounter: 1}
        ]

        const users = [
            {uid: 1, login: 'denis', password: '123', email: 'denis@gmail.com', followersIds: [3], postsIds: [1, 2], forumIds: [1]},
            {uid: 2, login: 'artemii', password: '321', email: 'artemii@gmail.com', followersIds: [3], postsIds: [3, 4], forumIds: [1]},
            {uid: 3, login: 'aarna', password: 'qwerty', email: 'aarna@gmail.com', followsIds: [1, 2], postsIds: [5],},
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
            {forumId: 1, forumTitle: 'Apples', creatorId: 1, userIds: [1, 2], postIds: [3, 4], isPrivate: false},
            {forumId: 2, forumTitle: 'Cars', creatorId: 2, userIds: [2], postIds: [1, 2], isPrivate: true},
            {forumId: 3, forumTitle: 'Pineapples', creatorId: 3, userIds: [3], postIds: [5], isPrivate: false},
            {forumId: 4, forumTitle: 'highboys', creatorId: 4, userIds: [4, 1], postIds: [6], isPrivate: true}
        ];

        await User.insertMany(users);
        await Counter.insertMany(counters);
        await Forum.insertMany(forums);
        await Post.insertMany(posts);

    } catch (error) {
        console.error('Error populating fields in tests/framework/setup.js', error);
    }
};
