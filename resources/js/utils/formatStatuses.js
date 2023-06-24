export function getDocumentStatus (status) {
	let statusText = "";
	let statusClass = "";
	switch (status) {
		case 'A':
		case 'D':
			statusText = "APPROVED w/o COMMENTS";
			statusClass = "success";
			break;
		case 'B':
			statusText = "APPROVED WITH COMMENT/S";
			statusClass = "info";
			break;
		case 'C':
			statusText = "FAIL/NOT APPROVED";
			statusClass = "error";
			break;
		case 'E':
		case 'F':
			statusText = "NO OBJECTION WITH COMMENTS";
			statusClass = "warning";
			break;
		default:
			statusText = "PENDING";
			statusClass = "warning";
			break;
	}
	return { statusText, statusClass };
}

export function getDocumentReviewStatus (status) {
	let statusText = "";
	let statusClass = "";
	switch (status) {
		case 'A':
			statusText = "APPROVED";
			statusClass = "success";
			break;
		case 'B':
			statusText = "SONO";
			statusClass = "secondary";
			break;
		case 'C':
			statusText = "FAIL/NOT APPROVED";
			statusClass = "error";
			break;
		case 'D':
			statusText = "APPROVED WITH COMMENT/S";
			statusClass = "info";
			break;
		case 'E':
		case 'F':
			statusText = "NO OBJECTION WITH COMMENTS";
			statusClass = "info";
			break;
		default:
			statusText = "PENDING ACTION";
			statusClass = "warning";
			break;
	}
	return { statusText, statusClass };
}


export function getInventoryStatus (qty, minQty) {
	// if (qty <= 0) return "out_of_stock";
	// if (minQty > qty) return "low_stock"
	// if (Math.ceil((minQty * 0.80)) >= qty) return "need_reorder";
	// return "in_stock"
	if (qty <= 0) return "out_of_stock";
	if (qty < minQty) return "low_stock";
	const lowStockThreshold = Math.ceil(minQty + 9);
	if (qty >= minQty && qty < lowStockThreshold) return "need_reorder";
	return "in_stock";
}