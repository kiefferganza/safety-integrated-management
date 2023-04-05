

// ----------------------------------------------------------------------

export default function useActiveLink (routeNames = []) {

	return {
		active: routeNames.includes(route().current()),
		isExternalLink: false,
	};
}
