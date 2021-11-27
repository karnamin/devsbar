// connecting to mongoDB database
const mongoose = require('mongoose'); // importing mongoose
const config = require('config'); // importing config JSON file
const db = config.get('mongoURI'); // getting the mongoURI

// async await function to connect to DB
const connectDB = async () => {
    try {
        // connecting to DB
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('MongoDB Connected...');
    } catch (error) {
        console.error(error.message);

        // Exit process with failure
        process.exit();
    }
};

module.exports = connectDB; // exporting connectDB function
