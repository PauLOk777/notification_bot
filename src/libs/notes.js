const Note = require('../models/Note.js');

async function addNoteGetId(message) {
	const indexOfSpace = message.indexOf(' ');
	const priority = +message.substring(0, indexOfSpace);
	const text = message.substring(indexOfSpace + 1, message.length);

	const note = new Note({
		priority,
		text
	});

	const res = await note.save();
	return res._id;
}

async function getNoteById(id) {
	return await Note.findById(id);
}

async function deleteNoteById(_id) {
	await Note.deleteOne({ _id });
}

module.exports = {
	addNoteGetId,
	getNoteById,
	deleteNoteById
}