const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config.js');
const logger = require('./logs/logger.js');
const keyboard = require('./keyboards/home-keyboard.js');
const buttons = require('./buttons/home-buttons.js');
const {
	addUser,
	checkUniqueUser,
	addNoteInList
} = require('./libs/users.js');
const { checkNote } = require('./helpers/isNote.js');
const db = require('./init/db.js');

const bot = new TelegramBot(config.TOKEN, { polling: true });
logger.botStarted();
db.init();

bot.onText(/\/start/, async(msg) => {
	const welcomeText = `<b>Hello, <i>${msg.from.first_name}</i></b>.
	<b>I can help you with your notes.
	You can send me some notes and set priority, 
	also you can edit and delete it.Just try it:)
	My owner: <i><a href="https://t.me/paul200">here</a></i></b>`;

	// Добавление нового уникального пользователя в бд
	if (await checkUniqueUser(msg.from.id)) 
		await addUser(msg.from.id, msg.from.first_name);

	bot.sendMessage(msg.chat.id, welcomeText, { 
		parse_mode: "HTML",
		disable_web_page_preview: true,
		reply_markup: {
			keyboard: keyboard.home
		} 
	});
});

bot.on('message', async(msg) => {

	switch (msg.text) {
		case buttons.home.addNote:
			// Нажата кнопка добавить заметку
			bot.sendMessage(msg.chat.id, 
				`Write your note like:\n` + `'Priority' 'Your note'`);
			return;
		case buttons.home.showAll:
			// Нажата кнопка показать все заметки

	}

	// Проверка на запрос добавления новой заметки
	if (checkNote(msg.text)) {
		if (!(await addNoteInList(msg.from.id, msg.text))) {
			bot.sendMessage(msg.chat.id, 'Start bot for make requests.');
		} else {
			bot.sendMessage(msg.chat.id, 'Your note was added to list.');
		}
	} else if (msg.text[0] != '/') {
		bot.sendMessage(msg.chat.id, 'Bad request. Try more.');	
	}
});