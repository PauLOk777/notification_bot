function check(text) {
	let numbers = '0123456789';
	
	for (let i = 0; i < 10; i++) {
		if(text[0] == numbers[i] && text[1] == ' ') {
			return true;
		}
	}

	return false;
}

module.exports = { check };