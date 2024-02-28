const express = require('express');
const mongoose = require('mongoose');

// Import controllers
const userRoute = require('./routes/user');
const watchlistRoute = require('./routes/watchlist');

// Add more controllers as needed

// Create Express application
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Should conceal this somehow.
const dbName = '';
const username = 'denis';
const password = 'kilseev';
const host = '3.131.91.146';
const portMongo = '28018';

// Connection URI
const uri = `mongodb://${username}:${password}@${host}:${portMongo}/${dbName}`;

// Connect to MongoDB
mongoose.connect(uri, {
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes.
app.use('/users', userRoute);
app.use('/watchlists', watchlistRoute)

module.exports = app;
