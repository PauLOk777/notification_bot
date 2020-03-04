const { getNoteById } = require('../libs/notes.js');
const { checkNote } = require('./isNote.js');

async function checkUpdateQuery(text) {
	if (text.indexOf('\n') != -1) return false;
	const elements = text.split(' ');
	if (elements.length < 4) return false;
	if (!(await getNoteById(elements[0]))) return false;
	if (!(await checkNote(elements[2] + ' ' + elements[3]))) return false;
	return true;
}

module.exports = { checkUpdateQuery };