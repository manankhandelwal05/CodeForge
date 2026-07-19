const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
console.log(process.env.MONGO_URI);
// mongoose.connect("mongodb://127.0.0.1:27017/test");
async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    // mongoose.connect("mongodb://127.0.0.1:27017/test");
}

module.exports = main;


