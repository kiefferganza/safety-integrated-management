import { isAfter, isEqual } from "date-fns";

const WEEK = 7;

export function getLastTwoWeeks (date) {
	const comparedDate = new Date(date);
	const lastWeek = new Date(comparedDate.getFullYear(), comparedDate.getMonth(), comparedDate.getDate() - (WEEK * 2));
	return lastWeek;
}



export function getTrainingStatus (date_expired) {
	const dateExpiredTwoWeeksBeforeDate = getLastTwoWeeks(date_expired);

	const start = new Date().setHours(0, 0, 0, 0)
	const end = new Date(date_expired).setHours(0, 0, 0, 0);

	if (isAfter(start, end) || isEqual(start, end)) {
		return {
			text: "Expired",
			color: "error",
			rawColor: "#FFAC82"
		}
	}

	if (start > dateExpiredTwoWeeksBeforeDate && start < end) {
		return {
			text: "Soon to Expire",
			color: "warning",
			rawColor: "#FFD666"
		}
	}

	return {
		text: "Valid",
		color: "success",
		rawColor: "#86E8AB"
	};
}

export function getTrainingActionStatus (externalStatus) {
	let status = externalStatus;
	if (typeof status !== "string") {
		status = externalStatus?.review_status !== "accepted" || externalStatus?.review_status !== "fail" ? externalStatus?.review_status : externalStatus?.approval_status;
	}

	switch (status) {
		case "pending":
			return {
				status,
				color: "warning"
			}
		case "commented":
			return {
				status,
				color: "info"
			}
		case "accepted":
		case "approved":
			return {
				status,
				color: "success"
			}
		case "failed":
		case "rejected":
			return {
				status,
				color: "error"
			}
		default:
			return {
				status,
				color: "default"
			}
	}

}