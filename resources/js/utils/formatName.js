


export const getCurrentUserName = (user) => `${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`;


export const getCurrentUserImage = (user) => {
	if (user?.profile_pic) {
		return `/storage/media/photos/employee/${user?.profile_pic}`;
	} else if (user?.employee?.src) {
		return `/storage/media/photos/employee/${user.emplyoee.src}`;
	} else if (user?.employee?.img_src) {
		return `/storage/media/photos/employee/${user.employee.img_src}`;
	}
	return null;
}