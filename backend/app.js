const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the path module
const bodyParser = require('body-parser');


// Import controllers
const userRoute = require('./routes/user'); 
const forumRoute = require('./routes/forum'); 
const postRoute = require('./routes/post'); 
const watchListRoute = require('./routes/watchlist');
const movieRoute = require('./routes/movie');
const profileRoute = require('./routes/profile')
// Add more controllers as needed


// Create Express application
const app = express();
app.use(bodyParser.json());
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
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/users', userRoute);
app.use('/forums', forumRoute);
app.use('/posts', postRoute);
app.use('/watchlists', watchListRoute);
app.use('/movies', movieRoute);
app.use('/profile', profileRoute)

module.exports = app;
