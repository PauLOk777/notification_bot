const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config.js');
const logger = require('./logs/logger.js');
const keyboard = require('./keyboards/home-keyboard.js');

const bot = new TelegramBot(config.TOKEN, { polling: true });
logger.botStarted();

bot.onText(/\/start/, msg => {
	const welcomeText = `<b>Hello, <i>${msg.from.first_name}</i></b>.
	<b>I can help you with your notes.
	You can send me some notes and set priority, 
	also you can edit and delete it.Just try it:)
	My owner: <i><a href="https://t.me/paul200">here</a></i></b>`;

	bot.sendMessage(msg.chat.id, welcomeText, { 
		parse_mode: "HTML",
		disable_web_page_preview: true,
		reply_markup: {
			keyboard: keyboard.home
		} });
});

bot.on('message', msg => {
	
});