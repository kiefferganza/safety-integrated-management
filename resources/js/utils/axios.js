import axios from "axios";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: "/" });

axiosInstance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || "Something went wrong"
        )
);

export const fetchTbtByType = (type) =>
    axiosInstance.get(route("api.tbt.type", { type })).then((res) => res.data);

export const getNotifications = () =>
    axiosInstance.get(route("api.user.notifications")).then((res) => res.data);

export const readNotification = (ids) =>
    axiosInstance.post(route("api.user.read_notifications"), { ids });

export const getEmails = () =>
    axiosInstance.get(route("api.user.emails")).then((res) => res.data);

export const getTrainingsChartByYear = (year) =>
    axiosInstance
        .get(route("api.dashboard.trainings_by_year", year))
        .then((res) => res.data);

export const getInhouseMatrix = ({ from, to }) =>
    axiosInstance
        .get(route("api.training.inhouse_matrix", { from, to }))
        .then((res) => res.data);

export const getExternalMatrix = ({ from, to }) =>
    axiosInstance
        .get(route("api.training.external_matrix", { from, to }))
        .then((res) => res.data);

export const fetchPositions = () =>
    axiosInstance.get(route("api.positions")).then((res) => res.data);

export const fetchPreplanning = () =>
    axiosInstance
        .get(route("api.tbt.preplanning.tracker"))
        .then((res) => res.data);

export const fetchAssignedTracker = () =>
    axiosInstance
        .get(route("api.tbt.tracker.assigned"))
        .then((res) => res.data);

export const fetchInspectionTracker = () => axiosInstance.get(route("api.inspections.tracker")).then((res) => res.data);

export default axiosInstance;
