import { format, getTime, formatDistanceToNow, isValid } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate (date, newFormat) {
	const fm = newFormat || 'dd MMM yyyy';
	const d = new Date(date);
	if (isValid(d)) {
		return date ? format(d, fm) : '';
	}
	return "Invalid date";
}

export function fTime (date, newFormat) {
	const fm = newFormat || 'p';
	const d = new Date(date);
	if (isValid(d)) {
		return date ? format(d, fm) : '';
	}
	return "Invalid date";
}

export function fDateTime (date, newFormat) {
	const fm = newFormat || 'dd MMM yyyy p';

	return date ? format(new Date(date), fm) : '';
}

export function fTimestamp (date) {
	return date ? getTime(new Date(date)) : '';
}

export function fToNow (date) {
	return date
		? formatDistanceToNow(new Date(date), {
			addSuffix: true,
		})
		: '';
}
