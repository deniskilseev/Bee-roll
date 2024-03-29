const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import controllers
const userRoute = require('./routes/user'); 
const forumRoute = require('./routes/forum'); 
const postRoute = require('./routes/post'); 
const watchListRoute = require('./routes/watchlist');
const movieRoute = require('./routes/movie');
const reviewRoute = require('./routes/review');
// Add more controllers as needed

// Create Express application
const app = express();
app.use(cors());

// Middleware
app.use(express.json()); // Parse JSON bodies

// Should conceal this somehow.
const dbName = '';
const username = 'denis';
const password = 'kilseev';
const host = '3.144.154.13';
const portMongo = '28018';

// Connection URI
const uri = `mongodb://${username}:${password}@${host}:${portMongo}/${dbName}`;

// Connect to MongoDB
mongoose.connect(uri, {
    useUnifiedTopology: true,
    dbName: 'prodDatabase'
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes.
app.use('/users', userRoute);
app.use('/forums', forumRoute);
app.use('/posts', postRoute);
app.use('/watchlists', watchListRoute);
app.use('/movies', movieRoute);
app.use('/reviews', reviewRoute);

module.exports = app;
