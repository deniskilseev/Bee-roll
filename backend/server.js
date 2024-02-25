const app = require('./app')
// Add more routes for additional controllers as needed

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});