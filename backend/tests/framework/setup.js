const testDatabaseConnection = require('./testDatabaseConnection');
const User = require('../../model/User')
const Counter = require('../../model/Counter')
const Forum = require('../../model/Forum')

module.exports = async () => {
    try {
        await testDatabaseConnection();

        const counters = [
            {_id: "User", collectionCounter: 4},
            {_id: "Forum", collectionCounter: 3}
        ]

        const users = [
            {uid: 1, login: 'denis', password: '123', email: 'denis@gmail.com', },
            {uid: 2, login: 'artemii', password: '321', email: 'artemii@gmail.com', },
            {uid: 3, login: 'aarna', password: 'qwerty', email: 'aarna@gmail.com', },
            {uid: 4, login: 'sreekar', password: 'ytrewq', email: 'sreekar@gmail.com', }
        ];

        const forums = [
            {forumId: 1, forumTitle: 'Apples', creatorId: 1},
            {forumId: 2, forumTitle: 'Cars', creatorId: 2},
            {forumId: 3, forumTitle: 'Pineapples', creatorId: 3}
        ];

        await User.insertMany(users);
        await Counter.insertMany(counters);
        await Forum.insertMany(forums);


    } catch (error) {
        console.error('Error populating fields in tests/framework/setup.js', error);
    }
};