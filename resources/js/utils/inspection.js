


export const getScoreColor = (score) => {
	if (score == "1") return "success.main";
	if (score == "2") return "warning.main";
	if (score == "3") return "error.main";
	if (score == "4") return "rgba(145, 158, 171, 0.16)";
	return "#fff";
}