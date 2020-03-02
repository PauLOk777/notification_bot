const User = require('../models/User.js');
const { 
	getNoteById,
	addNoteGetId
} = require('./notes.js');

async function addUser(chatId, username) {
	const user = new User({
        chatId,
        username
    });

    await user.save();
}

async function getNotes(chatId) {

}

async function addNoteInList(chatId, message) {
	const users = await User.find({ chatId });
	if (!users.length) return false;
	const id = await addNoteGetId(message);
	users[0].notes.push({note: id});
	users[0].save();
	return true;
}

async function checkUniqueUser(chatId) {
	const users = await User.find({ chatId });
	if (!users.length) return true;
	return false;
}

module.exports = {
	addUser,
	addNoteInList,
	getNotes,
	checkUniqueUser
}