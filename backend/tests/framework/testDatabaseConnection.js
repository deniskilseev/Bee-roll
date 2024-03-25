const mongoose = require('mongoose');

async function connectToDatabase() {
    await mongoose.connect('mongodb://denis:kilseev@3.144.154.13:28018/', {
        // useNewUrlParser: true,
        dbName: 'testDatabase',
        useUnifiedTopology: true,
    });
}

module.exports = connectToDatabase;