const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

try {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} catch (error) {
    console.log(error);
}

const schema = new mongoose.Schema({
    user: String,
    message: String,
    caption: String,
    link: String,
});

module.exports = mongoose.model('Cache', schema);