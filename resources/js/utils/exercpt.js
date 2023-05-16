


export function excerpt (text, length = 24) {
	if (text.length < length) {
		return text;
	}
	return text.substr(0, length) + '...';
}

export function ellipsis (text, maxLen = 10) {
	if (text.length > maxLen) {
		return text.substring(0, maxLen) + "...";
	} else {
		return text;
	}
}