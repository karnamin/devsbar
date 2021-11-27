const express = require('express'); // importing express function
const connectDB = require('./config/db'); // importing function to connect to DB

const app = express(); // app has express method

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running')); // creating '/' endpoint

const PORT = process.env.PORT || 5000; // process.env.port for heroku, localhost 5000 for development

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // listening for connections on PORT
