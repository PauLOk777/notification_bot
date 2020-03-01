const mongoose = require('mongoose');
const { promisify } = require('util');
const config = require('../config/config.js');

const URL = config.MONGO_URL;

async function init() {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    try {
        await promisify(mongoose.connect).call(mongoose, URL);
    } catch (err) {
        console.error(`Database connection error: ${err.message}`);
        process.exit(1);
    }
    console.error('>>> Database was connected');
}

module.exports = { init };