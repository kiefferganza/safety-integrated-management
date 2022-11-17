

// ----------------------------------------------------------------------

import { usePage } from "@inertiajs/inertia-react";

export default function useActiveLink (path, deep = true) {
	const { url } = usePage();

	const urlSplit = url.split("/");
	const pathSplit = path.split("/");

	// const normalActive = path ? !!matchPath({ path, end: true }, pathname) : false;

	// const deepActive = path ? !!matchPath({ path, end: false }, pathname) : false;
	const normalActive = (url === path);

	const deepActive = urlSplit[1] + urlSplit[2] + urlSplit[3] === pathSplit[1] + pathSplit[2] + pathSplit[3];

	return {
		active: deep ? deepActive : normalActive,
		isExternalLink: path.includes('http'),
	};
}
