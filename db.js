const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
require('./model');

async function connect() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    const conn = mongoose.connection;
    
    conn.on('connected', () => {
        console.log('Database connected');
    });
    
    conn.on('error', (err) => {
        console.log('Database connection error: ' + err);
    });
}

module.exports = connect;
