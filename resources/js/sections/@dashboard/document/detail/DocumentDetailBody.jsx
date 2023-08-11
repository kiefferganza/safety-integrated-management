import { useState } from 'react';
const { Box, Button, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } = await import('@mui/material');
import { getDocumentReviewStatus, getDocumentStatus } from '@/utils/formatStatuses';
// Components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Label from '@/Components/label/Label';
import DocumentComments from './DocumentComments';
import { Inertia } from '@inertiajs/inertia';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useSwal } from '@/hooks/useSwal';
import { DocumentUpdateFileDialog } from '../portal/DocumentUpdateFileDialog';
import { TableEmptyRows } from '@/Components/table';
import { ReUploadFile } from '@/Components/dialogs/ReUploadFile';
import DocumentExternalComment from '@/sections/shared/document/detail/DocumentExternalComment';
const { DocumentApproveFailDialog } = await import('../portal/DocumentApproveFailDialog');
const { DocumentCommentDialog } = await import('../portal/DocumentCommentDialog');

const DocumentDetailBody = ({ document, docType, user, positions }) => {
	const { load, stop } = useSwal();
	const [customDocType, setCustomDocType] = useState(null);
	const [openComment, setOpenComment] = useState(false);
	const [openAction, setOpenAction] = useState(false);
	const [openUpdateFile, setOpenUpdateFile] = useState(false);
	const [updateFileInfo, setUpdateFileInfo] = useState(null);
	const [openUpdateSubmitterFileInfo, setOpenUpdateSubmitterFileInfo] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [actionResponseId, setActionResponseId] = useState(null);

	const docStat = document.approval_sign ? getDocumentReviewStatus(document.status) : getDocumentStatus(document.status);
	// reviewer
	const canReviewStatus = checkCanReview({ docType, document, user });
	// approval
	const approvalPos = document.approval_employee ? positions.find(pos => pos.position_id === document.approval_employee.position).position : null;
	const canApprove = checkCanApprove({ docType, document });

	const handleOpenReuploadSubmitterFile = () => {
		setOpenUpdateSubmitterFileInfo(true);
	}

	const handleCloseReuploadSubmitterFile = () => {
		setOpenUpdateSubmitterFileInfo(false);
	}

	const handleOpenUpdateFile = (info) => {
		setOpenUpdateFile(true);
		setUpdateFileInfo(info);
	}

	const handleCloseUpdateFile = () => {
		setOpenUpdateFile(false);
		setUpdateFileInfo(null)
	}

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
	const canComment = document.approval_sign !== null ? false : typeof docType === "string" ? docType === "review" : true;
	const isAlreadySigned = document.comments.findIndex(com => document.reviewer_employees.findIndex(rev => rev.employee_id === com.reviewer_id) !== -1) !== -1;
	const reviewerStatus = document.reviewer_employees.find(revEmp => revEmp.employee_id === user?.employee?.employee_id)?.pivot?.review_status;
	return (
		<>
			<Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Internal Comments
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
								Comment Code Legend:
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

									<TableCell align="left">INTERNAL COMMENTS</TableCell>

									<TableCell align="left">Reply Code</TableCell>

									<TableCell align="left">ORIGINATOR REPLY</TableCell>

									<TableCell align="left">Status</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{document.comments.length > 0 ? (
									document.comments.map((row, index) => {
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
												onAction={handleAction}
												user={user}
											/>
										)
									})
								) : (
									<TableRow>
										<TableCell colSpan={8} align="center">No Comments</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						External Comments
					</Typography>
				</Stack>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Comment Code Legend:
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
				{document.external_comments.length > 0 ? (
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

											<TableCell align="left">EXTERNAL COMMENTS</TableCell>

											<TableCell align="left">Reply Code</TableCell>

											<TableCell align="left">ORIGINATOR REPLY</TableCell>

											<TableCell align="left">Status</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										{document.external_comments.map((row, index) => {
											const commentStatus = row.status == 0 ? { text: "Open", color: "success" } : { text: "Closed", color: "error" }
											const shareableLink = (document?.shareable_link || []).find(link => (document.external_approver || []).findIndex(app => app.id === link.custom_properties?.id) !== -1);
											return (
												<DocumentExternalComment
													key={row.id}
													row={row}
													index={index}
													reviewer={document.external_approver[0]}
													commentStatus={commentStatus}
													docType={typeof docType === "string" ? docType : ""}
													onDelete={() => handleDeleteComment(row.id)}
													shareableLink={shareableLink}
												/>
											)
										})}
									</TableBody>
								</Table>
							</Scrollbar>
						</TableContainer>
					</>
				) : (
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

											<TableCell align="left">REVIEWER COMMENTS</TableCell>

											<TableCell align="left">Reply Code</TableCell>

											<TableCell align="left">ORIGINATOR REPLY</TableCell>

											<TableCell align="left">Status</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										<TableRow>
											<TableCell colSpan={8} align="center">In Progress</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Scrollbar>
						</TableContainer>
					</>
				)}
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Document Status Code
				</Typography>
				<Typography variant="caption" sx={{ color: 'text.disabled' }}>
					Note: you can only choose status code when all of your comments as a reviewer is closed.
				</Typography>
				<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" border={1} sx={{ borderColor: "text.disabled", mt: 2 }}>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "A" });
						}}
						borderRight={1}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatus || "").toLowerCase() === "a"}
					>A.  Approved</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "B" });
						}}
						borderRight={1}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatus || "").toLowerCase() === "b"}
					>B.  SONO</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "C" });
						}}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatus || "").toLowerCase() === "c"}
					>C.  Fail / Not approved</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "D" });
						}}
						borderRight={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatus || "").toLowerCase() === "d"}
					>D.  Approved with comments</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "E" });
						}}
						borderRight={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatus || "").toLowerCase() === "e"}
					>E.  NOWC: No Objection with comments</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "F" });
						}}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatus || "").toLowerCase() === "f"}
					>F.  Responded / Reviewed / Actioned</ReviewStatus>
				</Box>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Internal Reviewer Comments Status
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={6}>
						<Stack alignItems="center">
							<Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
								Internal Approver Comments Status
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
				{document.external_approver?.length > 0 && (
					<>
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
												<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Full name</TableCell>

												<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Position</TableCell>

												<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Remarks</TableCell>

												<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											{document?.external_approver?.map((app) => {
												const appStatus = getDocumentReviewStatus(app.status);
												return (
													<TableRow key={app.id}>
														<TableCell align="left">{app?.firstname} {app?.lastname}</TableCell>

														<TableCell align="left">{app?.position || "N/A"}</TableCell>

														<TableCell align="left">{app?.remarks || "N/A"}</TableCell>

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
					</>
				)}
				{document.status === "0" && isAlreadySigned && (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Button
							fullWidth
							size="large"
							variant="contained"
							color="secondary"
							onClick={handleOpenReuploadSubmitterFile}
						>Re-upload File</Button>
					</>
				)}
				{canApprove && (
					document.approval_sign !== null ? (
						<>
							<Divider sx={{ borderStyle: "dashed", my: 2 }} />
							<Grid container spacing={3}>
								<Grid item md={4} xs={12}>
									<Button
										fullWidth
										size="large"
										variant="contained"
										color="secondary"
										onClick={() => handleOpenUpdateFile({ name: "update-approval-file", id: document.approval_sign.approval_sign_id })}
									>Re-upload File</Button>
								</Grid>
								<Grid item md={4} xs={12}>
									{document?.status === "A" ? (
										<Button fullWidth size="large" variant="contained" color="success" disabled>Approved</Button>
									) : (
										<Button fullWidth size="large" variant="contained" color="success" onClick={() => {
											setCustomDocType("approve");
											handleAction({ status: "A" });
										}}>Approved</Button>
									)}
								</Grid>
								<Grid item md={4} xs={12}>
									{document?.status === "C" ? (
										<Button fullWidth size="large" variant="contained" color="error" disabled>Fail/Not approved</Button>
									) : (
										<Button fullWidth size="large" variant="contained" color="error" onClick={() => {
											setCustomDocType("approve");
											handleAction({ status: "C" });
										}}>Fail/Not approved</Button>
									)}
								</Grid>
							</Grid>
						</>
					) : (
						<>
							<Divider sx={{ borderStyle: "dashed", my: 2 }} />
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<Button fullWidth size="large" variant="contained" color="success" onClick={() => {
										setCustomDocType("approve");
										handleAction({ status: "A" });
									}}>Approved</Button>
								</Grid>
								<Grid item md={6} xs={12}>
									<Button fullWidth size="large" variant="contained" color="error" onClick={() => {
										setCustomDocType("approve");
										handleAction({ status: "C" });
									}}>Fail/Not approved</Button>
								</Grid>
							</Grid>
						</>
					)
				)}
			</Stack>

			<DocumentCommentDialog
				open={openComment}
				onClose={() => { setOpenComment(false); }}
				documentId={document.document_id}
				isAlreadySigned={isAlreadySigned}
			/>
			<DocumentApproveFailDialog
				open={openAction}
				onClose={handleCloseAction}
				selectedStatus={selectedStatus}
				actionResponseId={actionResponseId}
				documentId={document.document_id}
				docType={customDocType}
			/>
			<DocumentUpdateFileDialog
				open={openUpdateFile}
				onClose={handleCloseUpdateFile}
				documentId={document.document_id}
				updateFileInfo={updateFileInfo}
			/>

			<ReUploadFile
				open={openUpdateSubmitterFileInfo}
				onClose={handleCloseReuploadSubmitterFile}
				remarks={document?.remarks || ''}
				routeName={route('files.management.document.reupload_submitter_file', document.document_id)}
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

function checkCanReview ({ docType, document, user }) {
	const type = typeof docType === "string" ? docType : "review";
	const currReviewSign = document?.reviewer_sign?.find(revS => revS?.user_id === user?.emp_id);
	if (type === "review" && currReviewSign) return false;
	if (document.approval_sign !== null) return false;
	if (type !== "review") return false;
	const reviewerComments = document.comments.filter(com => com.reviewer_id === user?.employee?.employee_id);
	if (reviewerComments.length === 0) return true;
	return reviewerComments.every(com => com.comment_status === 1);
}

function checkCanApprove ({ docType, document }) {
	const type = typeof docType === "string" ? docType : "approve";
	if (type !== "approve") return false;
	return document.reviewer_sign.length === document.reviewer_employees.length;
}

export default DocumentDetailBody