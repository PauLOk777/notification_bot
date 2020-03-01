const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
	priority: { type: Number, required: true },
    text: { type: String, required: true }
});

const Note = mongoose.model('note', NoteSchema);

module.exports = Note;