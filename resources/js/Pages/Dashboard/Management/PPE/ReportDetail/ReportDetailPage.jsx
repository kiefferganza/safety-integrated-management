import { useState } from 'react';
const { Box, Button, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } = await import('@mui/material');
import { getDocumentReviewStatus, getDocumentStatus } from '@/utils/formatStatuses';
// Components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Label from '@/Components/label/Label';
import { Inertia } from '@inertiajs/inertia';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useSwal } from '@/hooks/useSwal';
import { sentenceCase } from 'change-case';
import { usePage } from '@inertiajs/inertia-react';
import { ReportNewCommentDialog } from '@/sections/@dashboard/ppe/portal/ReportNewCommentDialog';

const ReportDetailPage = ({ inventoryReport }) => {
	const { auth: { user } } = usePage().props;
	const { load, stop } = useSwal();
	const [customDocType, setCustomDocType] = useState(null);
	const [openComment, setOpenComment] = useState(false);
	const [openAction, setOpenAction] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [actionResponseId, setActionResponseId] = useState(null);


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

	const reviewerStatusCode = inventoryReport.reviewer_status || "";
	const reviewerStatus = getDocumentReviewStatus(inventoryReport.reviewer_status);
	const canReviewStatus = inventoryReport.status === "for_review" && inventoryReport.approval_id === user?.emp_id ? (
		inventoryReport.comments.length === 0 ? true : !inventoryReport.comments.some(com => com.status === "open")
	) : false;
	const canApprove = inventoryReport.status !== "for_review" && inventoryReport.approval_id === user?.emp_id;
	return (
		<>
			<Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Reviewer's comments
					</Typography>
					{inventoryReport.reviewer_id === user?.emp_id && (
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
								{inventoryReport.comments.map((row, index) => {
									return (
										<h1>wew</h1>
										// <DocumentComments
										// 	key={row.response_id}
										// 	row={row}
										// 	index={index}
										// 	reviewer={reviewer}
										// 	commentStatus={commentStatus}
										// 	docType={typeof docType === "string" ? docType : "review"}
										// 	onDelete={() => handleDeleteComment(row.response_id)}
										// 	onAction={handleAction}
										// 	user={user}
										// />
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
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "A" });
						}}
						borderRight={1}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatusCode || "").toLowerCase() === "a"}
					>A.  Approved</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "B" });
						}}
						borderRight={1}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatusCode || "").toLowerCase() === "b"}
					>B.  SONO</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "C" });
						}}
						borderBottom={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatusCode || "").toLowerCase() === "c"}
					>C.  Fail / Not approved</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "D" });
						}}
						borderRight={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatusCode || "").toLowerCase() === "d"}
					>D.  Approved with comments</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "E" });
						}}
						borderRight={1}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatusCode || "").toLowerCase() === "e"}
					>E.  NOWC: No Objection with comments</ReviewStatus>
					<ReviewStatus
						onClick={() => {
							if (!canReviewStatus) return;
							handleAction({ status: "F" });
						}}
						canReviewStatus={canReviewStatus}
						isSelected={(reviewerStatusCode || "").toLowerCase() === "f"}
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

										<TableCell align="left">Full name</TableCell>

										<TableCell align="left">Position</TableCell>

										<TableCell align="left">Remarks</TableCell>

										<TableCell align="left">Status</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									<TableRow>

										<TableCell align="left">{inventoryReport?.reviewer.fullname}</TableCell>

										<TableCell align="left">{inventoryReport?.reviewer.position}</TableCell>

										<TableCell align="left">{inventoryReport?.reviewer_remarks || "N/A"}</TableCell>

										<TableCell align="left">
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
									<TableRow>
										<TableCell align="left">{inventoryReport.approval?.fullname}</TableCell>

										<TableCell align="left">{inventoryReport.approval.position}</TableCell>

										<TableCell align="left">{inventoryReport?.approval_remarks || "N/A"}</TableCell>

										<TableCell align="left">
											<Label
												variant="soft"
												color={
													(inventoryReport.approval_status === 'fail' && 'error') || (inventoryReport.approval_status === 'approved' && 'success') || 'warning'
												}
												sx={{ textTransform: "Capitalize" }}
											>
												{inventoryReport.approval_status}
											</Label>
										</TableCell>
									</TableRow>
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
				)}
			</Stack>

			<ReportNewCommentDialog
				open={openComment}
				onClose={() => { setOpenComment(false); }}
				inventoryReportId={inventoryReport.id}
			/>
			{/* <DocumentApproveFailDialog
				open={openAction}
				onClose={handleCloseAction}
				selectedStatus={selectedStatus}
				actionResponseId={actionResponseId}
				documentId={document.document_id}
				docType={customDocType}
			/> */}
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


export default ReportDetailPage