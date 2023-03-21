import { excerpt } from "@/utils/exercpt";
import { getDocumentReviewStatus } from "@/utils/formatStatuses";
import { usePage } from "@inertiajs/inertia-react";
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import Label from "@/Components/label";


const ReportTableSubRow = ({ row, open }) => {
	const { positions } = usePage().props;

	const approvalStatus = getDocumentReviewStatus(row.status);
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
											color={"warning"}
											sx={{ textTransform: "none" }}
										>
											{row.reviewer_status}
										</Label>
									</TableCell>
								</TableRow>
							</TableBody>
							<TableHead>
								<TableRow>
									<TableCell>Approval</TableCell>
									<TableCell>Position</TableCell>
									<TableCell>Remarks</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>
										{row.approval.fullname}
									</TableCell>
									<TableCell>
										{row.approval?.position}
									</TableCell>
									<TableCell>{row?.approval_remarks}</TableCell>
									<TableCell>
										<Label
											variant="soft"
											color={"warning"}
											sx={{ textTransform: "none" }}
										>
											{row.approval_status}
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