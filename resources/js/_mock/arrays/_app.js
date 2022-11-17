import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _appRelated = ['Chrome', 'Drive', 'Dropbox', 'Evernote', 'Github'].map(
	(name, index) => ({
		id: _mock.id(index),
		name,
		system: (index === 2 && 'Windows') || (index === 4 && 'Windows') || 'Mac',
		price: index === 0 || index === 2 || index === 4 ? 0 : _mock.number.price(index),
		rating: _mock.number.rating(index),
		review: randomNumberRange(999, 99999),
		shortcut:
			(name === 'Chrome' && '/storage/assets/icons/apps/ic_chrome.svg') ||
			(name === 'Drive' && '/storage/assets/icons/apps/ic_drive.svg') ||
			(name === 'Dropbox' && '/storage/assets/icons/apps/ic_dropbox.svg') ||
			(name === 'Evernote' && '/storage/assets/icons/apps/ic_evernote.svg') ||
			'/storage/assets/icons/apps/ic_github.svg',
	})
);

// ----------------------------------------------------------------------

export const _appInstalled = ['de', 'en', 'fr', 'kr', 'us'].map((country, index) => ({
	id: _mock.id(index),
	name: ['Germany', 'England', 'France', 'Korean', 'USA'][index],
	android: randomNumberRange(999, 99999),
	windows: randomNumberRange(999, 99999),
	apple: randomNumberRange(999, 99999),
	flag: `/storage/assets/icons/flags/ic_flag_${country}.svg`,
}));

// ----------------------------------------------------------------------

export const _appAuthors = [...Array(3)].map((_, index) => ({
	id: _mock.id(index),
	name: _mock.name.fullName(index),
	avatar: _mock.image.avatar(index),
	favourite: randomNumberRange(9999, 19999),
}));

// ----------------------------------------------------------------------

export const _appInvoices = [...Array(5)].map((_, index) => ({
	id: `${Date.now() + index}`,
	price: _mock.number.price(index),
	category: randomInArray(['Android', 'Mac', 'Windows']),
	status: randomInArray(['paid', 'out_of_date', 'in_progress']),
}));

// ----------------------------------------------------------------------

export const _appFeatured = [...Array(3)].map((_, index) => ({
	id: _mock.id(index),
	title: [
		'Harry Potter and the Deathly Hallows - Part 2',
		'Disney Zombies 2',
		'Lightroom mobile - Koloro',
	][index],
	description: _mock.text.title(index),
	image: _mock.image.cover(index),
}));
