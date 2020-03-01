const Note = require('../models/Note.js');

async function addNoteGetId(message) {
	const arrayOfSplit = message.split(' ', 2);
	const note = new Note({
		priority: +arrayOfSplit[0],
		text: arrayOfSplit[1]
	});

	const res = await note.save();
	return res._id;
}

async function getNoteById(id) {
	return await Note.findById(id);
}

module.exports = {
	addNoteGetId,
	getNoteById
}