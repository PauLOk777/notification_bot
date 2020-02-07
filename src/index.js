const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config.js');
const logger = require('./logs/logger.js');
const keyboard = require('./keyboards/home-keyboard.js');
const buttons = require('./buttons/home-buttons.js');
const isNote = require('./helpers/isNote.js');

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
		} 
	});
});

bot.on('message', msg => {

	switch (msg.text) {
		case buttons.home.addNote:
			// Нажата кнопка добавить заметку
			bot.sendMessage(msg.chat.id, 
				`Write your note like:\n` + `'Priority' 'Your note'`);
			break;

	}

	if (isNote.check(msg.text)) {
		console.log('Added to database');
		bot.sendMessage(msg.chat.id, 'Your note was added to list.')
	} else {
		bot.sendMessage(msg.chat.id, 'Bad request. Try more.')	
	}
});