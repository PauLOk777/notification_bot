const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config.js');
const logger = require('./logs/logger.js');
const TOKEN = config.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });
logger.botStarted();

bot.onText(/\/start/, msg => {

});

bot.on('message', msg => {
	console.log('Bot working...');
})