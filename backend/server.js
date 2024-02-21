const express = require('express');
const mongoose = require('mongoose');

// Import controllers
const userRoute = require('./routes/user'); 

// Add more controllers as needed

// Create Express application
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Should conceal this somehow.
const dbName = '';
const username = 'admin';
const password = 'adminpassword';
const host = '3.131.91.146';
const portMongo = '27017';

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


// Add more routes for additional controllers as needed

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});