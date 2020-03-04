const User = require('../models/User.js');
const { 
	getNoteById,
	addNoteGetId,
	deleteNoteById,
	updateNoteById
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
	user.notesCompleted++;
	user.numberOfNotes--;
	user.save();
}

async function addNoteInList(userId, message) {
	const user = await getUser(userId);
	if (!user) return false;
	const id = await addNoteGetId(message);
	user.notes.push({note: id});
	user.numberOfNotes++;
	user.save();
	return true;
}

async function checkUniqueUser(userId) {
	const user = await getUser(userId);
	if (!user) return true;
	return false;
}

async function updateNote(text) {
	const indecies = [];

	for (let i = 0; i < text.length; i++) {
		if (text[i] == ' ') indecies.push(i);
	}

	const noteId = text.substring(0, indecies[0]);
	const newPriority = text.substring(indecies[1] + 1, indecies[2]);
	const newText = text.substring(indecies[2] + 1, text.length);

	await updateNoteById(noteId, newPriority, newText);
}

async function getDeletedNote(_id) {
	const note = await getNoteById(_id);
	return note.text;
}

async function getNumberOfNotes(userId) {
	const user = await User.findOne({ userId });
	return user.numberOfNotes;
}

async function getCompletedNotes(userId) {
	const user = await User.findOne({ userId });
	return user.notesCompleted;
}

module.exports = {
	addUser,
	addNoteInList,
	getNotes,
	getUser,
	checkUniqueUser,
	deleteNote,
	updateNote,
	getDeletedNote,
	getCompletedNotes,
	getNumberOfNotes
}