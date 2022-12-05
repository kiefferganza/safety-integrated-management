import _ from 'lodash';


export const getCurrentUserName = (user) => `${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`;


export const getFullName = (user) => {
	const fname = _.capitalize(user?.firstname) || _.capitalize(user?.employee?.firstname);
	const mname = _.capitalize(user?.middlename) || _.capitalize(user?.employee?.middlename);
	const lname = _.capitalize(user?.lastname) || _.capitalize(user?.employee?.lastname);
	return `${fname}${mname?.trim() !== "." ? " " + mname + " " : " "}${lname}`
};


export const getCurrentUserImage = (user) => {
	if (user.img_src) {
		return `/storage/media/photos/employee/${user?.img_src}`;
	} else if (user?.profile_pic) {
		return `/storage/media/photos/employee/${user?.profile_pic}`;
	} else if (user?.employee?.src) {
		return `/storage/media/photos/employee/${user.emplyoee.src}`;
	} else if (user?.employee?.img_src) {
		return `/storage/media/photos/employee/${user.employee.img_src}`;
	}
	return null;
}


export const getImageSrc = (img) => {
	if (img) {
		return `/storage/media/photos/employee/${img}`;
	}
	return null;
}