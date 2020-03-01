function checkNote(text) {
	const numbers = '0123456789';
	const arrayOfSplit = text.split(' ', 2);
	let flag = false;

	for (let i = 0; i < arrayOfSplit[0].length; i++) {
		for (let j = 0; j < 10; j++) {
			if (arrayOfSplit[0][i] == numbers[j]) flag = true;
		}
		if (!flag) return false;
		flag = true;
	}
	return true;
}

module.exports = { checkNote };