


export function generateYears (minYear = null, maxYear = null) {
	let max = maxYear || new Date().getFullYear()
	let min = minYear || max - 9;
	let years = [];

	for (let i = max; i >= min; i--) {
		years.unshift(i)
	}
	return years
}