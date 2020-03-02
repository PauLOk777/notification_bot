const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config.js');
const logger = require('./logs/logger.js');
const homeKeyboard = require('./keyboards/home-keyboard.js');
const notesModKeyboard = require('./keyboards/notes-mod-inline-keyboard.js');
const homeButtons = require('./buttons/home-buttons.js');
const notesModButtons = require('./buttons/notes-mod-buttons.js');
const {
	addUser,
	checkUniqueUser,
	addNoteInList,
	getNotes,
	deleteNote
} = require('./libs/users.js');
const { checkNote } = require('./helpers/isNote.js');
const db = require('./init/db.js');

const bot = new TelegramBot(config.TOKEN, { polling: true });

async function init() {
	logger.botStarted();
	await db.init();
}

bot.onText(/\/start/, async(msg) => {
	const welcomeText = `<b>Hello, <i>${msg.from.first_name}</i></b>.
	<b>I can help you with your notes.
	You can send me some notes and set priority, 
	also you can edit and delete it. Just try it:)
	My owner <i><a href="https://t.me/paul200">here</a></i></b>`;

	// Добавление нового уникального пользователя в бд
	if (await checkUniqueUser(msg.from.id)) 
		await addUser(msg.from.id, msg.from.first_name);

	bot.sendMessage(msg.chat.id, welcomeText, { 
		parse_mode: "HTML",
		disable_web_page_preview: true,
		reply_markup: {
			keyboard: homeKeyboard
		} 
	});
});

bot.on('message', async(msg) => {

	switch (msg.text) {
		case homeButtons.addNote:
			// Нажата кнопка добавить заметку
			bot.sendMessage(msg.chat.id, 
				`Write your note like:\n` + `'Priority' 'Your note'`);
			return;
		case homeButtons.showAll:
			// Нажата кнопка показать все заметки
			// Получаем notes user'a
			const notes = await getNotes(msg.from.id);
			if (!notes.length) {
				bot.sendMessage(msg.chat.id, "You dont have any notes.");
			}

			for (const note of notes) {
				const text = `Priority: ${note.priority}\nText: ${note.text}`;

				await bot.sendMessage(msg.chat.id, text, {
					reply_markup: {
						inline_keyboard: notesModKeyboard(
							'delete ' + note._id, 'update ' + note._id
							)
					}
				});
			}
			return;
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

bot.on('callback_query', async(query) => {
	const commandAndId = query.data.split(' ');
	switch (commandAndId[0]) {
		case 'delete':
			await deleteNote(query.from.id, commandAndId[1]);
			bot.deleteMessage(query.message.chat.id, query.message.message_id);
			bot.sendMessage(query.message.chat.id, 'Congrats! You had done this note :)');
			return;
		case 'update':
			bot.sendMessage(query.message.chat.id, "Coming soon.");
			// bot.sendMessage(query.message.chat.id, 'Congrats! You updated this note :)');
			// bot.editMessageText(text, {
			// 	chat_id: query.message.chat.id,
			// 	message_id: query.message.message_id,
			// 	reply_markup: {
			// 		inline_keyboard: notesModKeyboard(
			// 			commandAndId[0] + commandAndId[1], commandAndId[0] + commandAndId[1]
			// 		)
			// 	}
			// });
			return;
	}
});

init();