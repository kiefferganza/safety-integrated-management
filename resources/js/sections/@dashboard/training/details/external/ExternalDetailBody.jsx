import { useState } from 'react';
const { Box, Button, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } = await import('@mui/material');
// Components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Label from '@/Components/label/Label';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import ExternalDetailComments from './ExternalDetailComments';
import { getTrainingActionStatus } from '@/utils/formatDates';
import { capitalCase } from 'change-case';
import { FormHelperText } from '@mui/material';
const { ExternalApproveFailDialog } = await import('../../portal/ExternalApproveFailDialog');
const { ExternalCommentDialog } = await import('../../portal/ExternalCommentDialog');

const ExternalDetailBody = ({ external_details, external_comments, external_status, training_id, type = "action" }) => {
	// const { load, stop } = useSwal();
	const { approval, reviewer } = external_details;
	const [actionType, setActionType] = useState(null);
	const [statusType, setStatusType] = useState("");
	const [openComment, setOpenComment] = useState(false);
	const [openAction, setOpenAction] = useState(false);
	// const [actionResponseId, setActionResponseId] = useState(null);


	const handleActionApprove = ({ type, action }) => {
		setActionType(type);
		setStatusType(action);
		setOpenAction(true);
	}
	const handleActionFail = ({ type, action }) => {
		setActionType(type);
		setStatusType(action)
		setOpenAction(true);
	}

	const handleCloseAction = () => {
		setOpenAction(false);
		setStatusType("");
	}

	// If no comments, can review otherwise check if all comments are closed
	const canReviewStatus = external_comments.length > 0 ? !external_comments.some(com => com.status === "open") : true;
	return (
		<>
			<Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Reviewer's comments
					</Typography>
					{type === "review" && (
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
								{external_comments.length > 0 ? external_comments.map((row, index) => (
									<ExternalDetailComments
										key={row.id}
										row={row}
										index={index}
										reviewer={reviewer}
										type={type}
									/>
								)) : (
									<TableRow>
										<TableCell><Box height={90} /></TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>
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
										<TableCell align="left">{reviewer?.fullname}</TableCell>

										<TableCell align="left">{reviewer?.position}</TableCell>

										<TableCell align="left">{external_status?.review_remark || "N/A"}</TableCell>

										<TableCell align="left">
											<Label variant="filled" sx={{ color: "#fff" }} color={getTrainingActionStatus(external_status?.review_status).color}>{capitalCase(external_status?.review_status || "")}</Label>
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
										<TableCell align="left">{approval?.fullname}</TableCell>

										<TableCell align="left">{approval?.position}</TableCell>

										<TableCell align="left">{external_status?.approval_remark || "N/A"}</TableCell>

										<TableCell align="left">
											<Label variant="filled" color={getTrainingActionStatus(external_status?.approval_status).color}>{capitalCase(external_status?.approval_status || "")}</Label>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
				{type === "review" && (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Grid container spacing={3}>
							<Grid item md={6} xs={12}>
								<Button
									fullWidth
									size="large"
									variant="contained"
									color="success"
									disabled={!canReviewStatus || external_status?.review_status === "accepted" || external_status?.approval_status !== "in_review"}
									onClick={() => {
										handleActionFail({ type: "review", action: "accepted" })
									}}
								>
									Accepted/Approved
								</Button>
							</Grid>
							<Grid item md={6} xs={12}>
								<Button
									fullWidth
									size="large"
									variant="contained"
									color="error"
									disabled={!canReviewStatus || external_status?.review_status === "failed" || external_status?.approval_status !== "in_review"}
									onClick={() => {
										handleActionFail({ type: "review", action: "failed" })
									}}
								>
									Failed/Denied
								</Button>
							</Grid>
						</Grid>
						<FormHelperText sx={{ mb: 1.5 }}>Must closed all comments before taking action.</FormHelperText>
					</>
				)}
				{type === "approve" && external_status?.review_status === "accepted" && (
					<>
						<Divider sx={{ borderStyle: "dashed", my: 2 }} />
						<Grid container spacing={3}>
							<Grid item md={6} xs={12}>
								<Button
									fullWidth
									size="large"
									variant="contained"
									color="success"
									disabled={external_status?.approval_status === "approved"}
									onClick={() => {
										handleActionApprove({ type: "approve", action: "approved" })
									}}>Approved</Button>
							</Grid>
							<Grid item md={6} xs={12}>
								<Button
									fullWidth
									size="large"
									variant="contained"
									color="error"
									disabled={external_status?.approval_status === "rejected"}
									onClick={() => {
										handleActionFail({ type: "approve", action: "rejected" })
									}}>Fail/Rejected</Button>
							</Grid>
						</Grid>
					</>
				)}
			</Stack>

			<ExternalCommentDialog
				open={openComment}
				onClose={() => { setOpenComment(false); }}
				training_id={training_id}
			/>
			<ExternalApproveFailDialog
				open={openAction}
				onClose={handleCloseAction}
				trainingId={training_id}
				statusType={statusType}
				type={actionType}
			/>
		</>
	)
}

export default ExternalDetailBody