import { useState } from 'react';
const { Box, Button, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } = await import('@mui/material');
import { getDocumentReviewStatus, getDocumentStatus } from '@/utils/formatStatuses';
// Components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Label from '@/Components/label/Label';
import DocumentComments from './DocumentComments';
import { DocumentUpdateFileDialog } from '../portal/DocumentUpdateFileDialog';
import ReportActionDialog from '@/Components/dialogs/ReportActionDialog';
import DocumentExternalComment from './DocumentExternalComment';
const { DocumentCommentDialog } = await import('../portal/DocumentCommentDialog');

const DocumentDetailBody = ({ document, positions, customUser, sharedLink, appStatus }) => {
	const [openComment, setOpenComment] = useState(false);
	const [openUpdateFile, setOpenUpdateFile] = useState(false);
	const [updateFileInfo, setUpdateFileInfo] = useState(null);
	const [openReviewAction, setOpenReviewAction] = useState(false);

	const docStat = document.approval_sign ? getDocumentReviewStatus(document.status) : getDocumentStatus(document.status);
	// reviewer
	// const canReviewStatus = checkCanReview({ customUser, document });
	const canReviewStatus = false;
	// approval
	const approvalPos = document.approval_employee ? positions.find(pos => pos.position_id === document.approval_employee.position).position : null;
	const canApprove = customUser.firstname;

	const handleOpenUpdateFile = (info) => {
		setOpenUpdateFile(true);
		setUpdateFileInfo(info);
	}

	const handleCloseUpdateFile = () => {
		setOpenUpdateFile(false);
		setUpdateFileInfo(null)
	}

	const handleOpenReviewAction = () => {
		setOpenReviewAction(true);
	}

	const handleCloseReviewAction = () => {
		setOpenReviewAction(false);
	}


	const handleDeleteComment = (commentId) => {
		// const commentLength = document.comments.length;
		// Inertia.post(PATH_DASHBOARD.fileManager.deleteComment(commentId), { commentLength }, {
		// 	preserveScroll: true,
		// 	onStart () {
		// 		load("Deleting comment", "please wait...");
		// 	},
		// 	onFinish () {
		// 		stop();
		// 	}
		// });
	}

	const canComment = customUser?.status === "0";
	console.log(customUser)
	return (
		<>
			<Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Internal comments
					</Typography>
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
				{document.comments.length > 0 ? (
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
												docType={typeof docType === "string" ? docType : "review"}
												onDelete={() => handleDeleteComment(row.response_id)}
											/>
										)
									})}
								</TableBody>
							</Table>
						</Scrollbar>
					</TableContainer>
				) : (
					<Stack width={1} height={90} />
				)}
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						External comments
					</Typography>
					{canComment && (
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
				{document.external_comments.length > 0 && (
					<>
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
										{document.external_comments.map((row, index) => {
											const commentStatus = row.status == 0 ? { text: "Open", color: "success" } : { text: "Closed", color: "error" }
											return (
												<DocumentExternalComment
													key={row.id}
													row={row}
													index={index}
													reviewer={customUser}
													commentStatus={commentStatus}
													docType={"review"}
													onDelete={() => handleDeleteComment(row.id)}
												/>
											)
										})}
									</TableBody>
								</Table>
							</Scrollbar>
						</TableContainer>
					</>
				)}
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Status Codes
				</Typography>
				<Typography variant="caption" sx={{ color: 'text.disabled' }}>
					Note: you can only choose status code when all of your comments is closed.
				</Typography>
				<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" border={1} sx={{ borderColor: "text.disabled", mt: 2 }}>
					<ReviewStatus
						isSelected={customUser?.status === "A"}
						borderRight={1}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
					>A.  Approved</ReviewStatus>
					<ReviewStatus
						isSelected={customUser?.status === "B"}
						borderRight={1}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
					>B.  SONO</ReviewStatus>
					<ReviewStatus
						isSelected={customUser?.status === "C"}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
					>C.  Fail / Not approved</ReviewStatus>
					<ReviewStatus
						isSelected={customUser?.status === "D"}
						borderRight={1}
						canReviewStatus={canReviewStatus}
					>D.  Approved with comments</ReviewStatus>
					<ReviewStatus
						isSelected={customUser?.status === "E"}
						borderRight={1}
						canReviewStatus={canReviewStatus}
					>E.  NOWC: No Objection with comments</ReviewStatus>
					<ReviewStatus
						isSelected={customUser?.status === "F"}
						canReviewStatus={canReviewStatus}
					>F.  Responded / Reviewed / Actioned</ReviewStatus>
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

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Full name</TableCell>

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Position</TableCell>

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Remarks</TableCell>

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
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
										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Full name</TableCell>

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Position</TableCell>

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Remarks</TableCell>

										<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{document.approval_employee && approvalPos && (
										<TableRow>
											<TableCell align="left">{document.approval_employee?.fullname}</TableCell>

											<TableCell align="left">{approvalPos}</TableCell>

											<TableCell align="left">{document?.remarks || "N/A"}</TableCell>

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
				<Divider sx={{ borderStyle: "dashed", my: 3 }} />
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								External Comments Status
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={12}>
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
									{document?.external_approver?.map((app) => {
										return (
											<TableRow key={app.id}>
												<TableCell align="left">{app?.firstname} {app?.lastname}</TableCell>

												<TableCell align="left">{customUser?.position || 'N/A'}</TableCell>

												<TableCell align="left">{customUser?.remarks || "N/A"}</TableCell>

												<TableCell align="left">
													<Label
														variant="soft"
														color={appStatus?.statusClass}
														sx={{ textTransform: 'capitalize' }}
													>
														{appStatus?.statusText}
													</Label>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
				{canApprove && (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Grid container spacing={3}>
							<Grid item xs={12}>
								{customUser?.status === "0" ? (
									<Button fullWidth size="large" variant="contained" color="success" onClick={handleOpenReviewAction}>Actions</Button>
								) : (
									<Button
										disabled={customUser.status === "0"}
										fullWidth
										size="large"
										variant="contained"
										color="secondary"
										onClick={() => handleOpenUpdateFile(route('shared.document.reuploadApprovalFile', {
											docApprover: customUser.id,
											_query: {
												token: sharedLink.token
											}
										}))}
									>Re-upload File</Button>
								)}
							</Grid>
						</Grid>
					</>
				)}
			</Stack>
			<ReportActionDialog
				open={openReviewAction}
				onClose={handleCloseReviewAction}
				actionInfo={{
					routeName: route('shared.document.approveOrFail', {
						document: document.document_id,
						docExternal: customUser.id,
						_query: {
							token: sharedLink.token
						}
					})
				}}
				status="A"
				remarks={customUser?.remarks}
			/>
			<DocumentCommentDialog
				sharedLink={sharedLink}
				open={openComment}
				onClose={() => { setOpenComment(false); }}
				documentId={document.document_id}
			/>
			<DocumentUpdateFileDialog
				open={openUpdateFile}
				onClose={handleCloseUpdateFile}
				documentId={document.document_id}
				updateFileInfo={updateFileInfo}
			/>
		</>
	)
}

function ReviewStatus ({ canReviewStatus, onClick, isSelected = false, children, ...others }) {
	const isSelectedStyle = isSelected ? {
		color: "primary.main",
		fontWeight: "600",
		cursor: canReviewStatus ? "pointer" : "default",
	} : {
		color: "text.disabled",
		"&:hover": {
			color: canReviewStatus ? "text.primary" : "text.disabled",
			cursor: canReviewStatus ? "pointer" : "default",
			backgroundColor: "rgba(0, 0, 0, 0.04)"
		}
	};
	return (
		<Box
			onClick={onClick}
			sx={{
				p: 1,
				...isSelectedStyle,
				borderColor: "text.disabled",
				...others
			}}>{children}</Box>
	)
}

export default DocumentDetailBody