import { useState } from 'react';
import { Box, Button, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getDocumentReviewStatus, getDocumentStatus } from '@/utils/formatStatuses';
// Components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Label from '@/Components/label/Label';
import DocumentComments from './DocumentComments';
import { Inertia } from '@inertiajs/inertia';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useSwal } from '@/hooks/useSwal';
import DocumentApproveFailDialog from '../portal/DocumentApproveFailDialog';
const { DocumentCommentDialog } = await import('../portal/DocumentCommentDialog');

const DocumentDetailBody = ({ document, docType, user, positions }) => {
	const { load, stop } = useSwal();
	const [openComment, setOpenComment] = useState(false);
	const [openAction, setOpenAction] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [actionResponseId, setActionResponseId] = useState(null);


	const docStat = document.approval_sign ? getDocumentReviewStatus(document.status) : getDocumentStatus(document.status);
	// reviewer
	const canReviewStatus = checkCanReview({ docType, document, user });


	// approval
	const approvalPos = document.approval_employee ? positions.find(pos => pos.position_id === document.approval_employee.position).position : null;
	const canApprove = checkCanApprove({ docType, document });

	console.log({ document });

	const handleAction = ({ status, responseId }) => {
		setSelectedStatus(status);
		if (responseId) {
			setActionResponseId(responseId);
		}
		setOpenAction(true);
	}

	const handleCloseAction = () => {
		setOpenAction(false);
		setActionResponseId(null);
		setSelectedStatus("");
	}

	const handleDeleteComment = (commentId) => {
		const commentLength = document.comments.filter(com => com.reviewer_id === user?.employee?.employee_id).length;
		Inertia.post(PATH_DASHBOARD.fileManager.deleteComment(commentId), { commentLength }, {
			preserveScroll: true,
			onStart () {
				load("Deleting comment", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	return (
		<>
			<Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Reviewer's comments
					</Typography>
					{docType === "review" && (
						<Button
							variant="text"
							startIcon={<Iconify icon="eva:plus-fill" />}
							onClick={() => { setOpenComment(true); }}
						>
							New Comment
						</Button>
					)}
				</Stack>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Reviewer Comment Code Legend:
							</Typography>
							<Typography variant="caption" sx={{ color: 'text.disabled' }}>
								1 = action required on this issue, 2 = advisory comment
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Originator Reply Code Legend:
							</Typography>
							<Typography variant="caption" sx={{ color: 'text.disabled' }}>
								i = Incorporated, ii = Evaluated and not incorporated for reason stated
							</Typography>
						</Stack>
					</Grid>
				</Grid>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<TableContainer sx={{ overflow: 'unset' }}>
					<Scrollbar>
						<Table sx={{ minWidth: 960 }}>
							<TableHead
								sx={{
									borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
									'& th': { backgroundColor: 'transparent' },
								}}
							>
								<TableRow>
									<TableCell width={40}>#</TableCell>

									<TableCell align="left">Full name</TableCell>

									<TableCell align="left">
										<Box>Page/</Box>
										<Box>Section</Box>
									</TableCell>

									<TableCell align="left">
										<Box>Comment</Box>
										<Box>Code</Box>
									</TableCell>

									<TableCell align="left">REVIEWER's COMMENTS</TableCell>

									<TableCell align="left">Reply Code</TableCell>

									<TableCell align="left">ORIGINATOR REPLY</TableCell>

									<TableCell align="left">Status</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{document.comments.map((row, index) => {
									const reviewer = document.reviewer_employees?.find(revEmp => revEmp.employee_id === row.reviewer_id);
									const commentStatus = row.comment_status == 0 ? { text: "Open", color: "success" } : { text: "Closed", color: "error" }
									return (
										<DocumentComments
											key={row.response_id}
											row={row}
											index={index}
											reviewer={reviewer}
											commentStatus={commentStatus}
											docType={docType}
											onDelete={() => handleDeleteComment(row.response_id)}
											onAction={handleAction}
										/>
									)
								})}
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Document Review Status Code
				</Typography>
				<Typography variant="caption" sx={{ color: 'text.disabled' }}>
					Note: you can only choose status code when all of your comments as a reviewer is closed.
				</Typography>
				<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" border={1} sx={{ borderColor: "text.disabled", mt: 2 }}>
					<Box borderRight={1} borderBottom={1}
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "A" });
						}}
						sx={{
							p: 1,
							borderColor: "text.disabled",
							color: "text.disabled",
							"&:hover": {
								color: canReviewStatus ? "text.primary" : "text.disabled",
								cursor: canReviewStatus ? "pointer" : "default",
								backgroundColor: "rgba(0, 0, 0, 0.04)"
							}
						}}>A.  Approved</Box>
					<Box borderRight={1} borderBottom={1}
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "B" });
						}}
						sx={{
							p: 1,
							borderColor: "text.disabled",
							color: "text.disabled",
							"&:hover": {
								color: canReviewStatus ? "text.primary" : "text.disabled",
								cursor: canReviewStatus ? "pointer" : "default",
								backgroundColor: "rgba(0, 0, 0, 0.04)"
							}
						}}>B.  SONO</Box>
					<Box borderBottom={1}
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "C" });
						}}
						sx={{
							p: 1,
							borderColor: "text.disabled",
							color: "text.disabled",
							"&:hover": {
								color: canReviewStatus ? "text.primary" : "text.disabled",
								cursor: canReviewStatus ? "pointer" : "default",
								backgroundColor: "rgba(0, 0, 0, 0.04)"
							}
						}}>C.  Fail / Not approved</Box>
					<Box borderRight={1}
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "D" });
						}}
						sx={{
							p: 1,
							borderColor: "text.disabled",
							color: "text.disabled",
							"&:hover": {
								color: canReviewStatus ? "text.primary" : "text.disabled",
								cursor: canReviewStatus ? "pointer" : "default",
								backgroundColor: "rgba(0, 0, 0, 0.04)"
							}
						}}>D.  Approved with comments</Box>
					<Box borderRight={1}
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "E" });
						}}
						sx={{
							p: 1,
							borderColor: "text.disabled",
							color: "text.disabled",
							"&:hover": {
								color: canReviewStatus ? "text.primary" : "text.disabled",
								cursor: canReviewStatus ? "pointer" : "default",
								backgroundColor: "rgba(0, 0, 0, 0.04)"
							}
						}}>E.  NOWC: No Objection with comments</Box>
					<Box
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "F" });
						}}
						sx={{
							p: 1,
							borderColor: "text.disabled",
							color: "text.disabled",
							"&:hover": {
								color: canReviewStatus ? "text.primary" : "text.disabled",
								cursor: canReviewStatus ? "pointer" : "default",
								backgroundColor: "rgba(0, 0, 0, 0.04)"
							}
						}}>F.  Responded / Reviewed / Actioned</Box>
				</Box>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Reviewer Comments Status
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Approval Comments Status
							</Typography>
						</Stack>
					</Grid>
				</Grid>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<TableContainer sx={{ overflow: 'unset' }}>
							<Table>
								<TableHead
									sx={{
										borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
										'& th': { backgroundColor: 'transparent' },
									}}
								>
									<TableRow>
										<TableCell width={40}>#</TableCell>

										<TableCell align="left">Full name</TableCell>

										<TableCell align="left">Position</TableCell>

										<TableCell align="left">Remarks</TableCell>

										<TableCell align="left">Status</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{document?.reviewer_employees?.map((revEmp, idx) => {
										const revPos = positions.find(pos => pos.position_id === revEmp.position)?.position;
										const revStat = getDocumentReviewStatus(revEmp?.pivot?.review_status);
										return (
											<TableRow key={idx}>
												<TableCell width={40}>{idx + 1}</TableCell>

												<TableCell align="left">{revEmp?.fullname}</TableCell>

												<TableCell align="left">{revPos}</TableCell>

												<TableCell align="left">{revEmp?.pivot?.remarks}</TableCell>

												<TableCell align="left">
													<Label color={revStat.statusClass}>
														{revStat.statusText}
													</Label>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
					<Grid item xs={6}>
						<TableContainer sx={{ overflow: 'unset' }}>
							<Table>
								<TableHead
									sx={{
										borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
										'& th': { backgroundColor: 'transparent' },
									}}
								>
									<TableRow>
										<TableCell align="left">Full name</TableCell>

										<TableCell align="left">Position</TableCell>

										<TableCell align="left">Remarks</TableCell>

										<TableCell align="left">Status</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{document.approval_employee && approvalPos && (
										<TableRow>
											<TableCell align="left">{document.approval_employee?.fullname}</TableCell>

											<TableCell align="left">{approvalPos}</TableCell>

											<TableCell align="left">N/A</TableCell>

											<TableCell align="left">
												<Label color={docStat.statusClass}>{docStat.statusText}</Label>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
				{canApprove && (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Grid container spacing={3}>
							<Grid item md={6} xs={12}>
								<Button fullWidth size="large" variant="contained" color="success" onClick={() => handleAction({ status: "A" })}>Approved</Button>
							</Grid>
							<Grid item md={6} xs={12}>
								<Button fullWidth size="large" variant="contained" color="error" onClick={() => handleAction({ status: "C" })}>Fail/Not approved</Button>
							</Grid>
						</Grid>
					</>
				)}
			</Stack>

			<DocumentCommentDialog
				open={openComment}
				onClose={() => { setOpenComment(false); }}
				documentId={document.document_id}
			/>
			<DocumentApproveFailDialog
				open={openAction}
				onClose={handleCloseAction}
				selectedStatus={selectedStatus}
				actionResponseId={actionResponseId}
				documentId={document.document_id}
				docType={docType}
			/>
		</>
	)
}

function checkCanReview ({ docType, document, user }) {
	if (document.approval_sign !== null) return false;
	if (docType !== "review") return false;
	const reviewerComments = document.comments.filter(com => com.reviewer_id === user?.employee?.employee_id);
	if (reviewerComments.length > 0) return true;
	return !reviewerComments.some(com => com.reply_code === null);
}

function checkCanApprove ({ docType, document }) {
	if (docType !== "approve") return false;
	return document.reviewer_sign.length === document.reviewer_employees.length;
}

export default DocumentDetailBody