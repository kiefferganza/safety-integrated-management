


export function excerpt (text, length = 24) {
	if (text.length < length) {
		return text;
	}
	return text.substr(0, length) + '...';
}