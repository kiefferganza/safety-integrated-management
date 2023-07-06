
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Label from "@/Components/label";
import { capitalCase } from 'change-case';

export const TrainingThirdPartySubRow = ({ participants, external_details, external_status, actionStatus, open }) => {

	return (
		<TableRow>
			<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box sx={{ margin: 1 }}>
						<Table size="small">
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
												color={
													(external_status?.review_status === 'pending' && 'warning') || (external_status?.review_status === 'commented' && 'info') || ((external_status?.review_status === 'fail' || external_status?.review_status === 'for_revision') && 'error') || (external_status?.review_status === 'accepted' && 'success') || 'default'
												}
											>
												{capitalCase(external_status?.review_status || "")}
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
													variant="soft"
													color={
														(external_status?.approval_status === 'in_review' && 'default') || (external_status?.approval_status === 'rejected' && 'error') || (external_status?.approval_status === 'approved' && 'success') || 'default'
													}
												>
													{capitalCase(external_status?.approval_status || "")}
												</Label>
											</TableCell>
										</TableRow>
									</TableBody>
								</>
							)}
							{external_details?.requested && (
								<>
									<TableHead>
										<TableRow>
											<TableCell>Requested By</TableCell>
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
									</TableBody>
								</>
							)}
						</Table>
					</Box>
				</Collapse>
			</TableCell>

		</TableRow>
	)
}