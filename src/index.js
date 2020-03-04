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
	getUser,
	deleteNote,
	updateNote,
	getDeletedNote,
	getNumberOfNotes,
	getCompletedNotes
} = require('./libs/users.js');
const { checkNote } = require('./helpers/isNote.js');
const { checkUpdateQuery } = require('./helpers/checkUpdateQuery.js');
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
	if (!(await getUser(msg.from.id))) {
		bot.sendMessage(msg.chat.id, 'Start bot for make requests.');
		return;
	}

	if (await checkUpdateQuery(msg.text)) {
		const elements = msg.text.split(' ');
		let textForNote = "";

		for (let i = 3; i < elements.length; i++) {
			if (i == elements.length - 1) {
				textForNote += elements[i];
			} else {
				textForNote += elements[i] + ' ';
			}
		}

		const text = `Priority: ${elements[2]}\nText: ${textForNote}`;
		await updateNote(msg.text);
		bot.editMessageText(text, {
			chat_id: msg.chat.id,
			message_id: elements[1],
			reply_markup: {
				inline_keyboard: notesModKeyboard(
					'delete ' + elements[0], 'update ' + elements[0]
				)
			}
		});
		bot.sendMessage(msg.chat.id, `Your note was updated :)`);
		return;
	}

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
				return;
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
		case homeButtons.numberOfNotes:
			bot.sendMessage(msg.chat.id, `${msg.from.first_name}, current ` + 
				`number of your notes: ${await getNumberOfNotes(msg.from.id)}.`);
			return;
		case homeButtons.notesCompleted:
			bot.sendMessage(msg.chat.id, `${msg.from.first_name}, you ` + 
				`have completed: ${await getCompletedNotes(msg.from.id)} notes.`);
			return;
	}

	// Проверка на запрос добавления новой заметки
	if (checkNote(msg.text)) {
		if (!(await addNoteInList(msg.from.id, msg.text))) {
			bot.sendMessage(msg.chat.id, 'Start bot for make requests.');
			return;
		} else {
			bot.sendMessage(msg.chat.id, 'Your note was added to list.');
			return;
		}
	} else if (msg.text[0] != '/') {
		bot.sendMessage(msg.chat.id, 'Bad request. Try more.');	
		return;
	}
});

bot.on('callback_query', async(query) => {
	const commandAndId = query.data.split(' ');
	switch (commandAndId[0]) {
		case 'delete':
			const textOfDeleted = await getDeletedNote(commandAndId[1]);
			await deleteNote(query.from.id, commandAndId[1]);
			bot.deleteMessage(query.message.chat.id, query.message.message_id);
			bot.sendMessage(query.message.chat.id, `Congrats! You had done "${textOfDeleted}" :)`);
			return;
		case 'update':
			const text = 'Write next construction for updating your note:\n' +
			'"note_id" "message_id" "priority" "text_of_note"\n' +
			`Your note_id: ${commandAndId[1]}\n` +
			`Your message_id: ${query.message.message_id}\n` +
			'Copy this info to make correct query.';
			bot.sendMessage(query.message.chat.id, text);
			return;
	}
});

init();