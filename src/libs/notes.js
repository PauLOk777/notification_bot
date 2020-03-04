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
	let user;
	try {
	 	user = await Note.findById(_id);
	} catch (e) {
		return null;
	}
	return user;
}

async function deleteNoteById(_id) {
	await Note.deleteOne({ _id });
}

async function updateNoteById(_id, priority, text) {
	const note = await Note.findByIdAndUpdate(_id, { priority, text });
}

module.exports = {
	addNoteGetId,
	getNoteById,
	deleteNoteById,
	updateNoteById
}