import { useState } from 'react';
const { Box, Button, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } = await import('@mui/material');
import { getDocumentReviewStatus } from '@/utils/formatStatuses';
// Components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Label from '@/Components/label/Label';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import { usePage } from '@inertiajs/inertia-react';
import ReportNewCommentDialog from '@/sections/@dashboard/ppe/portal/ReportNewCommentDialog';
import ReportComments from '@/sections/@dashboard/ppe/details/ReportComments';
import ReportActionDialog from '@/sections/@dashboard/ppe/portal/ReportActionDialog';
import { FormHelperText } from '@mui/material';
import { ReUploadFile } from '@/Components/dialogs/ReUploadFile';

const ReportDetailPage = ({ inventoryReport }) => {
	const { auth: { user } } = usePage().props;
	const { load, stop } = useSwal();

	const [openReviewAction, setOpenReviewAction] = useState(false);
	const [openApproveAction, setOpenApproveAction] = useState(false);
	const [openComment, setOpenComment] = useState(false);

	const [openReupload, setOpenReupload] = useState(false);
	const [reuploadFileInfo, setReuploadFileInfo] = useState({
		routeName: null,
		remarks: "",
		data: null
	});

	const [approveStatus, setApproveStatus] = useState(null);

	const handleDeleteComment = (commentId) => {
		Inertia.delete(route("ppe.management.report.destroyComment", commentId), {
			preserveScroll: true,
			onStart () {
				load("Deleting comment", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const handleOpenReviewAction = () => {
		setOpenReviewAction(true);
	}

	const handleCloseReviewAction = () => {
		setOpenReviewAction(false);
	}


	const handleOpenApproveAction = () => {
		setOpenApproveAction(true);
	}

	const handleCloseApproveAction = () => {
		setOpenApproveAction(false);
		setApproveStatus(null);
	}

	const handleApproverAction = (status = "approved") => {
		console.log(status);
		setApproveStatus(status);
		handleOpenApproveAction();
	}

	const handleOpenUpdateReviewerFile = () => {
		setReuploadFileInfo({
			routeName: route('ppe.management.report.reupload_file', inventoryReport.id),
			remarks: inventoryReport.reviewer_remarks || "",
			data: {
				type: 'review'
			}
		});
		setOpenReupload(true);
	}

	const handleOpenUpdateApprovalFile = () => {
		setReuploadFileInfo({
			routeName: route('ppe.management.report.reupload_file', inventoryReport.id),
			remarks: inventoryReport.approval_remarks || "",
			data: {
				type: 'approval'
			}
		});
		setOpenReupload(true);
	}


	const handleCloseReupload = () => {
		setOpenReupload(false);
		setReuploadFileInfo({
			routeName: null,
			remarks: "",
			data: null
		});
	}


	const isAllCommentsClosed = inventoryReport.comments.every(com => com.status === "closed");

	const reviewerStatusCode = inventoryReport.reviewer_status || "";
	const reviewerStatus = getDocumentReviewStatus(inventoryReport.reviewer_status);
	const isCreator = inventoryReport.submitted_id === user?.emp_id;
	const isReviewer = inventoryReport.reviewer_id === user?.emp_id;
	const isApproval = inventoryReport.approval_id === user?.emp_id;

	const canReviewStatus = (inventoryReport.status === "for_review" && inventoryReport.status !== "closed") && isReviewer ? (
		inventoryReport.comments.length === 0 ? true : isAllCommentsClosed
	) : false;
	const canApprove = (inventoryReport.status !== "for_review" && inventoryReport.status !== "closed") && isApproval;

	let ActionButtons = <></>;

	switch (inventoryReport.status) {
		case 'for_approval':
			if (canApprove && isReviewer) {
				ActionButtons = (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<FormHelperText sx={{ marginLeft: "16px !important", marginTop: "0 !important", mb: 1 }}>Re-upload File for Reviewer</FormHelperText>
						<Button
							fullWidth
							size="large"
							variant="contained"
							color="secondary"
							onClick={handleOpenUpdateReviewerFile}
						>Re-upload Reviewer File</Button>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<FormHelperText sx={{ marginLeft: "16px !important", marginTop: "0 !important", mb: 1 }}>Approver Actions:</FormHelperText>
						<Grid container spacing={3}>
							<Grid item md={6} xs={12}>
								<Button fullWidth size="large" variant="contained" color="success" onClick={() => {
									handleApproverAction("approved")
								}}>Approved</Button>
							</Grid>
							<Grid item md={6} xs={12}>
								<Button fullWidth size="large" variant="contained" color="error" onClick={() => {
									handleApproverAction("fail");
								}}>Fail/Not approved</Button>
							</Grid>
						</Grid>
					</>
				)
			} else if (canApprove) {
				ActionButtons = (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Grid container spacing={3}>
							<Grid item md={6} xs={12}>
								<Button fullWidth size="large" variant="contained" color="success" onClick={handleApproverAction}>Approved</Button>
							</Grid>
							<Grid item md={6} xs={12}>
								<Button fullWidth size="large" variant="contained" color="error" onClick={() => {
									handleApproverAction("fail");
								}}>Fail/Not approved</Button>
							</Grid>
						</Grid>
					</>
				)
			} else if (isReviewer) {
				ActionButtons = (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Button
							fullWidth
							size="large"
							variant="contained"
							color="secondary"
							onClick={handleOpenUpdateReviewerFile}
						>Re-upload Reviewer File</Button>
					</>
				)
			}
			break;
		case 'closed':
			if (isApproval) {
				ActionButtons = (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Grid container spacing={3}>
							<Grid item md={4} xs={12}>
								<Button
									fullWidth
									size="large"
									variant="contained"
									color="secondary"
									onClick={handleOpenUpdateApprovalFile}
								>Re-upload File</Button>
							</Grid>
							<Grid item md={4} xs={12}>
								{inventoryReport?.approval_status === "approved" ? (
									<Button fullWidth size="large" variant="contained" color="success" disabled>Approved</Button>
								) : (
									<Button fullWidth size="large" variant="contained" color="success" onClick={handleApproverAction}>Approved</Button>
								)}
							</Grid>
							<Grid item md={4} xs={12}>
								{inventoryReport?.approval_status === "fail" ? (
									<Button fullWidth size="large" variant="contained" color="error" disabled>Fail/Not approved</Button>
								) : (
									<Button fullWidth size="large" variant="contained" color="error" onClick={() => {
										handleApproverAction("fail")
									}}>Fail/Not approved</Button>
								)}
							</Grid>
						</Grid>
					</>
				)
			}
			break;
		default:
			break;
	}
	return (
		<>
			<Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Reviewer's comments
					</Typography>
					{isReviewer && inventoryReport.status === "for_review" && (
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
										<ReportComments
											key={row.id}
											row={row}
											index={index}
											reviewer={inventoryReport.reviewer}
											onDelete={() => handleDeleteComment(row.id)}
											isCreator={isCreator}
											isReviewer={isReviewer}
											isClosed={inventoryReport.status === 'closed'}
										/>
									)
								})}
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>
				<Divider sx={{ borderStyle: "dashed", my: 2 }} />
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Review Status Code
					</Typography>
					{isReviewer && inventoryReport.status !== "closed" && (
						<Button
							variant="text"
							startIcon={<Iconify icon="material-symbols:check" />}
							onClick={handleOpenReviewAction}
							disabled={!canReviewStatus}
						>
							Finish Review
						</Button>
					)}
				</Stack>
				<Typography variant="caption" sx={{ color: 'text.disabled' }}>
					Note: you can only review when all of your comments as a reviewer is closed.
				</Typography>
				<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" border={1} sx={{ borderColor: "text.disabled", mt: 2 }}>
					<ReviewStatus
						borderRight={1}
						borderBottom={1}
						isSelected={((reviewerStatusCode || "").toLowerCase() === "a" && isReviewer)}
					>A.  Approved</ReviewStatus>
					<ReviewStatus
						borderRight={1}
						borderBottom={1}
						isSelected={((reviewerStatusCode || "").toLowerCase() === "b" && isReviewer)}
					>B.  SONO</ReviewStatus>
					<ReviewStatus
						borderBottom={1}
						isSelected={((reviewerStatusCode || "").toLowerCase() === "c" && isReviewer)}
					>C.  Fail / Not approved</ReviewStatus>
					<ReviewStatus
						borderRight={1}
						isSelected={((reviewerStatusCode || "").toLowerCase() === "d" && isReviewer)}
					>D.  Approved with comments</ReviewStatus>
					<ReviewStatus
						borderRight={1}
						isSelected={((reviewerStatusCode || "").toLowerCase() === "e" && isReviewer)}
					>E.  NOWC: No Objection with comments</ReviewStatus>
					<ReviewStatus
						isSelected={((reviewerStatusCode || "").toLowerCase() === "f" && isReviewer)}
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
				{ActionButtons}
			</Stack>

			<ReportNewCommentDialog
				open={openComment}
				onClose={() => { setOpenComment(false); }}
				inventoryReportId={inventoryReport.id}
			/>

			<ReportActionDialog
				open={openReviewAction}
				onClose={handleCloseReviewAction}
				inventoryReportId={inventoryReport.id}
				status="A"
				remarks={inventoryReport?.reviewer_remarks}
			/>

			<ReportActionDialog
				open={openApproveAction}
				onClose={handleCloseApproveAction}
				inventoryReportId={inventoryReport.id}
				status={approveStatus}
				submitText={approveStatus === "approved" ? "Approved" : "Fail/Not Approved"}
				title={approveStatus === "approved" ? "Approved" : "Fail/Not Approved"}
				type="approval"
				remarks={inventoryReport?.approval_remarks}
			/>
			<ReUploadFile
				open={openReupload}
				onClose={handleCloseReupload}
				remarks={reuploadFileInfo.remarks}
				routeName={reuploadFileInfo.routeName}
				additionalData={reuploadFileInfo.data}
			/>
		</>
	)
}

function ReviewStatus ({ isSelected = false, children, ...others }) {
	const isSelectedStyle = isSelected ? {
		color: "primary.main",
		fontWeight: "600",
	} : {
		color: "text.disabled"
	};
	return (
		<Box
			sx={{
				p: 1,
				...isSelectedStyle,
				borderColor: "text.disabled",
				...others
			}}>{children}</Box>
	)
}


export default ReportDetailPage