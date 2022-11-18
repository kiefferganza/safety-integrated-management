

// ----------------------------------------------------------------------

import { usePage } from "@inertiajs/inertia-react";

export default function useActiveLink (path, deep = true, hasChild = false) {
	const { url } = usePage();

	const urlSplit = url.split("/");
	const pathSplit = path.split("/");

	// const normalActive = path ? !!matchPath({ path, end: true }, pathname) : false;

	// const deepActive = path ? !!matchPath({ path, end: false }, pathname) : false;
	const normalActive = (url === path);

	const deepActive = hasChild ? ((url === path) || (urlSplit[2] === pathSplit[2])) : (url === path);

	return {
		active: deep ? deepActive : normalActive,
		isExternalLink: path.includes('http'),
	};
}
