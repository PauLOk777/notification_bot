const buttons = require('../buttons/notes-mod-buttons.js');

function getNotesModKeyboard(cb_data1, cb_data2) {
	return [
		[
			{
				text: '✅',
				callback_data: cb_data1
			},
			{
				text: '✏️',
				callback_data: cb_data2
			}
		]
	];	
}

module.exports = getNotesModKeyboard;