import { usePage } from "@inertiajs/inertia-react";

// ----------------------------------------------------------------------

export default function usePermission () {
	const { auth: { permissions, role } } = usePage().props;
	function hasPermission (permission) {
		if (!permission) return false;
		if (role === "Admin") return true;
		return permission in permissions;
	}

	return [hasPermission, role, permissions];
}
