const mongoose = require('mongoose');
const { promisify } = require('util');

const URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pubchat';

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