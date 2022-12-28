

// ----------------------------------------------------------------------

import { usePage } from "@inertiajs/inertia-react";

export default function useActiveLink (path, deep = true, hasChild = false, childList) {
	const { url } = usePage();


	const urlSplit = url.split("/");
	const pathSplit = path?.split("/");

	const normalActive = (url === path);

	const getDeepActive = () => {
		if (hasChild) {
			return (url === path) || pathSplit[3] ? (urlSplit[2] === pathSplit[2] && urlSplit[3] === pathSplit[3]) : (urlSplit[2] === pathSplit[2]);
		} else {
			if (pathSplit.length > 4) {
				return (pathSplit[4] ? (pathSplit[4] === urlSplit[4] && urlSplit[3] === pathSplit[3] && urlSplit[2] === pathSplit[2]) : false);
			} else {
				return (pathSplit[3] ? (pathSplit[3] === urlSplit[3] && urlSplit[2] === pathSplit[2]) : false);
			}
		}
	}
	if (childList ? childList.includes(urlSplit[2]) : deep ? getDeepActive() : normalActive) {
		console.log(path, pathSplit, pathSplit.length);
	}
	return {
		active: childList ? childList.includes(urlSplit[2]) : deep ? getDeepActive() : normalActive,
		isExternalLink: path.includes('http'),
	};
}
