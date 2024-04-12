const mongoose = require('mongoose');

const collectionList = ["counters", "users", "posts", "forums", "watchlists", 'comments'];

module.exports = async () => {
    for (collection of collectionList) {
        await mongoose.connection.dropCollection(collection);
    }
    await mongoose.connection.close();
};
