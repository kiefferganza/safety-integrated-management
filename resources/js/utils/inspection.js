


export const getScoreColor = (score) => {
	if (score == "1") return "#385623";
	if (score == "2") return "#ffc000";
	if (score == "3") return "#c00000";
	if (score == "4") return "rgba(145, 158, 171, 0.16)";
	return "#fff";
}

export const getObservation = (reports = []) => {
	return reports.reduce((acc, curr) => {
		if (curr.ref_score !== 0 && curr.ref_score !== 4 && curr.ref_score !== null) {
			acc.totalObservation += 1;
		}
		if (curr.ref_score === 1) {
			acc.positiveObservation += 1;
		} else if ((curr.ref_score === 2 || curr.ref_score === 3) && curr.item_status !== "2") {
			acc.negativeObservation += 1;
		}
		return acc;
	}, { totalObservation: 0, positiveObservation: 0, negativeObservation: 0 });
}
