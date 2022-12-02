import { isAfter } from "date-fns";

const TODAY = new Date()
const WEEK = 7;

export function getLastTwoWeeks (date) {
	const comparedDate = new Date(date);
	const lastWeek = new Date(comparedDate.getFullYear(), comparedDate.getMonth(), comparedDate.getDate() - (WEEK * 2));
	return lastWeek;
}



export function getTrainingStatus (date_expired) {
	const dateExpiredTwoWeeksBeforeDate = getLastTwoWeeks(date_expired);

	if (isAfter(TODAY, dateExpiredTwoWeeksBeforeDate)) {
		return {
			text: "Expired",
			color: "error"
		}
	}

	const end = new Date(date_expired);
	if (TODAY > dateExpiredTwoWeeksBeforeDate && TODAY < end) {
		return {
			text: "Soon to Expire",
			color: "warning"
		}
	}

	return {
		text: "Valid ",
		color: "success"
	};
}