const mongoose = require('mongoose');

async function connectToDatabase() {
    await mongoose.connect('mongodb://denis:kilseev@18.189.22.191:28018/', {
        // useNewUrlParser: true,
        dbName: 'testDatabase',
        useUnifiedTopology: true,
    });
}

module.exports = connectToDatabase;