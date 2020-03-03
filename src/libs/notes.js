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

async function getNoteById(_id) {
	return await Note.findById(_id);
}

async function deleteNoteById(_id) {
	await Note.deleteOne({ _id });
}

async function updateNoteById(_id, priority, text) {
	const note = await Note.findByIdAndUpdate(_id, { priority, text });
	console.log(note);
}

module.exports = {
	addNoteGetId,
	getNoteById,
	deleteNoteById,
	updateNoteById
}