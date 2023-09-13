const mongoose = require('mongoose');

const dbURL = process.env.MONGO_URL;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect(dbURL, options)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

module.exports = mongoose.connection;
