import { excerpt } from "@/utils/exercpt";
import { getDocumentReviewStatus } from "@/utils/formatStatuses";
import { usePage } from "@inertiajs/inertia-react";
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import Label from "@/Components/label";


const DocumentTableSubRow = ({ row, open }) => {
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
									<TableCell>Signed File</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{row.reviewer_employees.length > 0 ? (
									row.reviewer_employees.map(revEmp => {
										const { position } = positions.find(p => p.position_id == revEmp.position);
										const stat = getDocumentReviewStatus(revEmp?.pivot?.review_status);
										const signedFile = row.reviewer_sign.find(f => f.user_id == revEmp.employee_id)
										return (
											<TableRow key={revEmp.employee_id}>
												<TableCell>
													{revEmp.fullname}
												</TableCell>
												<TableCell>
													{position}
												</TableCell>
												<TableCell>{revEmp?.pivot?.remarks || "N/A"}</TableCell>
												<TableCell>
													{signedFile?.src ? (
														<Tooltip title={signedFile.src}>
															<a href={`/storage/media/docs/${signedFile.src}`} target="_blank">{excerpt(signedFile.src, 16)}</a>
														</Tooltip>
													) : (
														<span className="text-muted">No signed files yet</span>
													)}
												</TableCell>
												<TableCell>
													<Label
														variant="soft"
														color={stat.statusClass}
														sx={{ textTransform: "none" }}
													>
														{stat.statusText}
													</Label>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={5} align="center">
											<Box component="span" sx={{ color: "text.disabled" }}>No Reviewers</Box>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
							{row.approval_employee && (
								<>
									<TableHead>
										<TableRow>
											<TableCell>Approval</TableCell>
											<TableCell>Position</TableCell>
											<TableCell>Remarks</TableCell>
											<TableCell>Signed File</TableCell>
											<TableCell>Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>
												{row.approval_employee.fullname}
											</TableCell>
											<TableCell>
												{positions.find(p => p.position_id === row.approval_employee.position)?.position || "N/A"}
											</TableCell>
											<TableCell>{row.approval_employee?.pivot?.remarks || "N/A"}</TableCell>
											<TableCell>
												{row.approval_sign?.src ? (
													<Tooltip title={row.approval_sign.src}>
														<a href={`/storage/media/docs/${row.approval_sign.src}`} target="_blank">{excerpt(row.approval_sign.src, 16)}</a>
													</Tooltip>
												) : (
													<Box component="span" sx={{ color: "text.disabled" }}>No signed files yet</Box>
												)}
											</TableCell>
											<TableCell>
												<Label
													variant="soft"
													color={approvalStatus.statusClass}
													sx={{ textTransform: "none" }}
												>
													{approvalStatus.statusText}
												</Label>
											</TableCell>
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

export default DocumentTableSubRow