import { useTranslation } from 'react-i18next';
// components
import { useSettingsContext } from '../Components/settings';
//
import { allLangs, defaultLang } from './config';

// ----------------------------------------------------------------------

export default function useLocales () {
	const { i18n, t: translate } = useTranslation();

	const { onChangeDirectionByLang } = useSettingsContext();

	const langStorage = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : '';

	const currentLang = allLangs.find((_lang) => _lang.value === langStorage) || defaultLang;

	const handleChangeLanguage = (newlang) => {
		i18n.changeLanguage(newlang);
		onChangeDirectionByLang(newlang);
	};

	return {
		onChangeLang: handleChangeLanguage,
		translate: (text, options) => translate(text, options),
		currentLang,
		allLangs,
	};
}
