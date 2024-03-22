const testDatabaseConnection = require('./testDatabaseConnection');
const User = require('../../model/User')
const Counter = require('../../model/Counter')

module.exports = async () => {
    try {
        await testDatabaseConnection();

        const counters = [
            {_id: "User", collectionCounter: 4},
            {_id: "Forum", collectionCounter: 1}
        ]

        const users = [
            {uid: 1, login: 'denis', password: '123', email: 'denis@gmail.com', },
            {uid: 2, login: 'artemii', password: '321', email: 'artemii@gmail.com', },
            {uid: 3, login: 'aarna', password: 'qwerty', email: 'aarna@gmail.com', },
            {uid: 4, login: 'sreekar', password: 'ytrewq', email: 'sreekar@gmail.com', }
        ];

        const forums = [];

        await User.insertMany(users);
        await Counter.insertMany(counters);


    } catch (error) {
        console.error('Error populating fields in tests/framework/setup.js', error);
    }
};