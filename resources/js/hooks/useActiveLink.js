

// ----------------------------------------------------------------------

import { usePage } from "@inertiajs/inertia-react";

export default function useActiveLink (path, deep = true, hasChild = false, childList) {
	const { url } = usePage();


	const urlSplit = url.split("/").filter(u => u.trim()).map(u => u.split("?")[0]);
	const pathSplit = path?.split("/").filter(u => u.trim()).map(u => u.split("?")[0]);

	const normalActive = (url === path);


	const getDeepActive = () => {
		if (hasChild) {
			return (url === path) || pathSplit[2] ? (urlSplit[1] === pathSplit[1] || urlSplit[2] === pathSplit[2]) : (urlSplit[1] === pathSplit[1]);
		} else {
			return url === path;
			// if (pathSplit.length > 4) {
			// 	return (pathSplit[4] ? (pathSplit[4] === urlSplit[4] && urlSplit[3] === pathSplit[3] && urlSplit[2] === pathSplit[2]) : false);
			// } else {
			// 	return (pathSplit[3] ? (pathSplit[3] === urlSplit[3] && urlSplit[2] === pathSplit[2]) : false);
			// }
		}
	}

	return {
		active: childList ? childList.includes(urlSplit[2]) : deep ? getDeepActive() : normalActive,
		isExternalLink: path.includes('http'),
	};
}
