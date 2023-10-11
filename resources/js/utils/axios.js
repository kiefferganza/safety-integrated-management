import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: "/" });

axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const fetchTbtByType = (type) => axiosInstance.get(route('api.tbt.type', { type })).then(res => res.data);

export default axiosInstance;
