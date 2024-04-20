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
const reviewRoute = require('./routes/review');
const predictRoute = require('./routes/predict');
const commentRoute = require('./routes/comment');
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
const host = '18.189.22.191';
const portMongo = '28018';

// Connection URI
const uri = `mongodb://${username}:${password}@${host}:${portMongo}/${dbName}`;

// Connect to MongoDB
mongoose.connect(uri, {
    useUnifiedTopology: true,
    dbName: process.env.DATABASE
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  const corsOptions = {
    origin: 'http://localhost:3001', // Update this with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    allowedHeaders: ['Content-Type'], // Include other allowed headers
};
// Routes.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/users', userRoute);
app.use('/forums', forumRoute);
app.use('/posts', postRoute);
app.use('/watchlists', watchListRoute);
app.use('/movies', movieRoute);
app.use('/reviews', reviewRoute);
app.use('/predict', predictRoute);
app.use('/comments', commentRoute);

module.exports = app;
