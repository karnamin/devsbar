const express = require('express'); // importing express function
const connectDB = require('./config/db'); // importing function to connect to DB

const app = express(); // app has express method

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running')); // creating '/' endpoint

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000; // process.env.port for heroku, localhost 5000 for development

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // listening for connections on PORT
