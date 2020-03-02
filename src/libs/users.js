const User = require('../models/User.js');
const { 
	getNoteById,
	addNoteGetId,
	deleteNoteById
} = require('./notes.js');

async function addUser(userId, username) {
	const user = new User({
        userId,
        username
    });

    await user.save();
}

async function getUser(userId) {
	const user = await User.findOne({ userId });
	return user;
}

async function getNotes(userId) {
	const arrayOfNotes = [];
 	const user = await getUser(userId);

 	for (const id of user.notes) {
 		arrayOfNotes.push(await getNoteById(id.note));
 	}
 	arrayOfNotes.sort((a, b) => {
 		if (a.priority < b.priority) {
 			return -1;
 		} else if (a.priority > b.priority) {
 			return 1;
 		} else return 0;
 	});

	return arrayOfNotes;
}

async function deleteNote(userId, id) {
	await deleteNoteById(id);
	const user = await getUser(userId);
	user.notes.forEach((element, index) => {
		if (element.note == id) {
			user.notes.splice(index, 1);
		}
	});
	user.save();
}

async function addNoteInList(userId, message) {
	const user = await getUser(userId);
	if (!user) return false;
	const id = await addNoteGetId(message);
	user.notes.push({note: id});
	user.save();
	return true;
}

async function checkUniqueUser(userId) {
	const user = await getUser(userId);
	if (!user) return true;
	return false;
}

module.exports = {
	addUser,
	addNoteInList,
	getNotes,
	checkUniqueUser,
	deleteNote
}