const mongoose = require('mongoose');

module.exports = async () => {
    const collectionList = await mongoose.connection.listCollections();
    for (collection of collectionList) {
        let name = collection.name;
        if (name !== "movies") {
            await mongoose.connection.dropCollection(name);
        }
    }
    await mongoose.connection.close();
};
