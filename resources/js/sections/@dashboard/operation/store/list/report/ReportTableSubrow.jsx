import { getDocumentReviewStatus } from "@/utils/formatStatuses";
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Label from "@/Components/label";


const ReportTableSubRow = ({ row, open }) => {

	const reviewerStatus = getDocumentReviewStatus(row.reviewer_status);
	return (
		<TableRow>
			<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box sx={{ margin: 1 }}>
						<Table size="small">
							<caption><span style={{ textTransform: "uppercase" }}>{row.formNumber}</span> - Reviewers and Approval Personels</caption>
							<TableHead>
								<TableRow>
									<TableCell>Reviewers</TableCell>
									<TableCell>Position</TableCell>
									<TableCell>Remarks</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow >
									<TableCell>
										{row.reviewer.fullname}
									</TableCell>
									<TableCell>
										{row.reviewer?.position}
									</TableCell>
									<TableCell>{row?.reviewer_remarks}</TableCell>
									<TableCell>
										<Label
											variant="soft"
											color={reviewerStatus.statusClass}
											sx={{ textTransform: "capitalize" }}
										>
											{reviewerStatus.statusText.toLowerCase()}
										</Label>
									</TableCell>
								</TableRow>
							</TableBody>
							<TableHead>
								<TableRow>
									<TableCell>Approver</TableCell>
									<TableCell>Position</TableCell>
									<TableCell>Remarks</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>
										{row.approver.fullname}
									</TableCell>
									<TableCell>
										{row.approver?.position}
									</TableCell>
									<TableCell>{row?.approver_remarks || "N/A"}</TableCell>
									<TableCell>
										<Label
											variant="soft"
											color={
												(row.approver_status === 'fail' && 'error') || (row.approver_status === 'approved' && 'success') || 'warning'
											}
											sx={{ textTransform: "Capitalize" }}
										>
											{row.approver_status}
										</Label>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Box>
				</Collapse>
			</TableCell>

		</TableRow>
	)
}

export default ReportTableSubRow;