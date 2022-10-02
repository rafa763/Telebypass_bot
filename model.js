const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


const schema = new mongoose.Schema({
    user: String,
    message: String,
    link: String,
});

module.exports = mongoose.model('Cache', schema);