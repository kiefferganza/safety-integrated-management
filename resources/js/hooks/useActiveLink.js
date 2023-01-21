

// ----------------------------------------------------------------------

import { usePage } from "@inertiajs/inertia-react";

export default function useActiveLink (path, deep = true, hasChild = false, childList) {
	const { url } = usePage();


	const urlSplit = url.split("/").filter(u => u.trim()).map(u => u.split("?")[0]);
	const pathSplit = path?.split("/").filter(u => u.trim()).map(u => u.split("?")[0]);

	const normalActive = (url === path);

	const getDeepActive = () => {
		if (hasChild) {
			if (childList) return childList.includes(urlSplit[1]);

			if (url === path) return true;

			return pathSplit[2] ? (urlSplit[1] === pathSplit[1] || urlSplit[2] === pathSplit[2]) : (urlSplit[1] === pathSplit[1]);
		} else {
			return url === path;
		}
	}

	return {
		active: deep ? getDeepActive() : normalActive,
		isExternalLink: path.includes('http'),
	};
}
