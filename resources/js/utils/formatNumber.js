import { currencies } from '@/_mock/arrays/_currencies';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber (number) {
	return numeral(number).format();
}

export function fCurrency (number) {
	const format = number ? numeral(number).format('$0,0.00') : '';

	return result(format, '.00');
}

export function fCurrencyNumber (number) {
	const format = number ? numeral(number).format('0,0.00') : '';

	return result(format, '.00');
}

export function fCurrencyNumberAndSymbol (number, currency) {
	const format = number ? numeral(number).format('0,0.00') : '';
	let currencySymbol = "$";
	if (currency in currencies) {
		currencySymbol = currencies[currency]?.symbol_native || "$";
	}
	return `${currencySymbol} ${result(format, '.00')}`;
}

export function fPercent (number) {
	const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

	return result(format, '.0');
}

export function fShortenNumber (number) {
	const format = number ? numeral(number).format('0.00a') : '';

	return result(format, '.00');
}

export function fData (number) {
	const format = number && number > 0 ? numeral(number).format('0.0 b') : '0 B';

	return result(format, '.0');
}

function result (format, key = '.00') {
	const isInteger = format.includes(key);

	return isInteger ? format.replace(key, '') : format;
}
