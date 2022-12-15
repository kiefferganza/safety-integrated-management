import { isAfter, isEqual } from "date-fns";

const TODAY = new Date()
const WEEK = 7;

export function getLastTwoWeeks (date) {
	const comparedDate = new Date(date);
	const lastWeek = new Date(comparedDate.getFullYear(), comparedDate.getMonth(), comparedDate.getDate() - (WEEK * 2));
	return lastWeek;
}



export function getTrainingStatus (training_date, date_expired) {
	const dateExpiredTwoWeeksBeforeDate = getLastTwoWeeks(date_expired);

	const start = new Date(training_date)
	const end = new Date(date_expired);

	if (isAfter(start, end) || isEqual(start, end)) {
		return {
			text: "Expired",
			color: "error"
		}
	}

	if (start > dateExpiredTwoWeeksBeforeDate && start < end) {
		return {
			text: "Soon to Expire",
			color: "warning"
		}
	}

	return {
		text: "Valid",
		color: "success"
	};
}