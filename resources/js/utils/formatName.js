


export const getCurrentUserName = (user) => `${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`;