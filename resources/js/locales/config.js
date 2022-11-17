// @mui
import { enUS, frFR, zhCN, viVN, arSD } from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
	{
		label: 'English',
		value: 'en',
		systemValue: enUS,
		icon: '/storage/assets/icons/flags/ic_flag_en.svg',
	},
	{
		label: 'French',
		value: 'fr',
		systemValue: frFR,
		icon: '/storage/assets/icons/flags/ic_flag_fr.svg',
	},
	{
		label: 'Vietnamese',
		value: 'vn',
		systemValue: viVN,
		icon: '/storage/assets/icons/flags/ic_flag_vn.svg',
	},
	{
		label: 'Chinese',
		value: 'cn',
		systemValue: zhCN,
		icon: '/storage/assets/icons/flags/ic_flag_cn.svg',
	},
	{
		label: 'Arabic (Sudan)',
		value: 'ar',
		systemValue: arSD,
		icon: '/storage/assets/icons/flags/ic_flag_sa.svg',
	},
];

export const defaultLang = allLangs[0]; // English
