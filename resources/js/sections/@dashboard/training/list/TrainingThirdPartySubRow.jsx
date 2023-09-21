
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Label from "@/Components/label";
import { getDocumentReviewStatus } from "@/utils/formatStatuses";

export const TrainingThirdPartySubRow = ({ participants, external_details, external_status, open }) => {
	const reviewerStatus = getDocumentReviewStatus(external_status.review_status);
	return (
		<TableRow>
			<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box sx={{ margin: 1 }}>
						<Table size="small">
							{external_details?.requested && (
								<>
									<TableHead>
										<TableRow>
											<TableCell>Submitted By</TableCell>
											<TableCell>Position</TableCell>
											<TableCell></TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>
												{external_details.requested.fullname}
											</TableCell>
											<TableCell>
												{external_details.requested?.position || "N/A"}
											</TableCell>
										</TableRow>
									</TableBody>
								</>
							)}
							<TableHead>
								<TableRow>
									<TableCell>Reviewer</TableCell>
									<TableCell>Position</TableCell>
									<TableCell>Remarks</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{external_details?.reviewer ? (
									<TableRow>
										<TableCell>
											{external_details.reviewer.fullname}
										</TableCell>
										<TableCell>
											{external_details.reviewer.position}
										</TableCell>
										<TableCell>{external_status?.review_remark || "N/A"}</TableCell>
										<TableCell>
											<Label
												variant="filled"
												color={reviewerStatus.statusClass}
												sx={{ textTransform: "capitalize" }}
											>
												{reviewerStatus.statusText.toLowerCase()}
											</Label>
										</TableCell>
									</TableRow>
								) : (
									<TableRow>
										<TableCell colSpan={5} align="center">
											<Box component="span" sx={{ color: "text.disabled" }}>No Reviewers</Box>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
							{external_details?.approval && (
								<>
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
												{external_details.approval.fullname}
											</TableCell>
											<TableCell>
												{external_details.approval?.position || "N/A"}
											</TableCell>
											<TableCell>{external_status?.approval_remark || "N/A"}</TableCell>
											<TableCell>
												<Label
													variant="filled"
													color={
														(external_status.approval_status === 'fail' && 'error') || (external_status.approval_status === 'approved' && 'success') || 'warning'
													}
													sx={{ textTransform: "Capitalize" }}
												>
													{external_status.approval_status}
												</Label>
											</TableCell>
										</TableRow>
									</TableBody>
								</>
							)}
							<TableRow>
								<TableCell rowSpan={3} />
								<TableCell />
								<TableCell sx={{ fontWeight: "bold" }}>Currency</TableCell>
								<TableCell>{external_details.currency}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell />
								<TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
								<TableCell>{external_details.course_price.toLocaleString()}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell />
								<TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
								<TableCell>{(participants * external_details.course_price).toLocaleString()}</TableCell>
							</TableRow>
						</Table>
					</Box>
				</Collapse>
			</TableCell>

		</TableRow>
	)
}