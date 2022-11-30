

// ----------------------------------------------------------------------

import { usePage } from "@inertiajs/inertia-react";

export default function useActiveLink (path, deep = true, hasChild = false, childList) {
	const { url } = usePage();

	const urlSplit = url.split("/");
	const pathSplit = path.split("/");

	const normalActive = (url === path);

	const deepActive = hasChild ? ((url === path) || (urlSplit[2] === pathSplit[2])) : (url === path);

	return {
		active: childList ? childList.includes(urlSplit[2]) : deep ? deepActive : normalActive,
		isExternalLink: path.includes('http'),
	};
}
