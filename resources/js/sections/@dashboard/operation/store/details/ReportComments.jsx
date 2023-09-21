import { useState } from 'react';
const { Box, Button, IconButton, TableCell, TableRow, Tooltip } = await import('@mui/material');
import Label from '@/Components/label/Label';
import Iconify from '@/Components/iconify/Iconify';
import ConfirmDialog from '@/Components/confirm-dialog/ConfirmDialog';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
const { DocumentReplyDialog } = await import('../portal/ReportReplyDialog');

const ReportComments = ({ index, row, reviewer, onDelete, isCreator, isReviewer, isClosed }) => {
	const { load, stop } = useSwal();
	const [openDelete, setOpenDelete] = useState(false);
	const [openReply, setOpenReply] = useState(false);
	const [openCloseComment, setOpenCloseComment] = useState(false);

	const handleOpenReply = () => {
		setOpenReply(true);
	}

	const handleCloseReply = () => {
		setOpenReply(false);
	}

	const handleOpenDelete = () => {
		setOpenDelete(true);
	}

	const handleCloseDelete = () => {
		setOpenDelete(false);
	}

	const handleCloseComment = () => {
		Inertia.put(route("operation.store.report.changeCommentStatus", row.id), {
			status: "closed",
		}, {
			preserveScroll: true,
			onStart () {
				setOpenCloseComment(false);
				load("Changing comment status", "please wait...");
			},
			onFinish () {
				stop();
			}
		})
	}

	const canDelete = isClosed ? false : isReviewer && row.status === "open" && row.reply === null;
	// const canClose = isReviewer && row.reply !== null && row.status === "open";
	const canReply = isClosed ? false : isCreator && !row?.reply_code;
	return (
		<>
			<TableRow
				sx={{
					borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
				}}
			>
				<TableCell>{index + 1}</TableCell>

				<TableCell align="left">{reviewer?.fullname}</TableCell>

				<TableCell align="left">
					{row.comment_page_section.split(",").map(page => (
						<Box component="span" display="block" key={page}>{page}</Box>
					))}
				</TableCell>

				<TableCell align="center">{row.comment_code}</TableCell>

				<TableCell align="left" sx={{ wordBreak: "break-all", maxWidth: "140px" }}>{row.comment}</TableCell>

				<TableCell align="center">{row?.reply_code}</TableCell>

				<TableCell align="center">{row?.reply}</TableCell>

				<TableCell align="center">
					<Label
						onClick={() => {
							if (row.status === "closed") return;
							setOpenCloseComment(true);
						}}
						sx={{
							cursor: row.status === "open" ? 'pointer' : 'default'
						}}
						color={
							(row.status === 'closed' && 'error') || (row.status === 'open' && 'info') || 'warning'
						}
					>
						{row.status}
					</Label>
				</TableCell>
				{canReply && (
					<TableCell align="left">
						<IconButton
							color="info"
							onClick={handleOpenReply}
						>
							<Tooltip title="Reply" arrow>
								<Iconify icon="ic:outline-reply" />
							</Tooltip>
						</IconButton>
					</TableCell>
				)}
				{canDelete && (
					<TableCell align="left">
						<IconButton
							color="error"
							onClick={handleOpenDelete}
						>
							<Iconify icon="eva:trash-2-outline" />
						</IconButton>
					</TableCell>
				)}
			</TableRow>

			<ConfirmDialog
				open={openDelete}
				onClose={handleCloseDelete}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={() => {
						onDelete();
						handleCloseDelete();
					}}>
						Delete
					</Button>
				}
			/>

			<ConfirmDialog
				open={openCloseComment}
				onClose={() => {
					setOpenCloseComment(false);
				}}
				title="Close Comment"
				content="Are you sure want to close this comment?"
				action={
					<Button variant="contained" color="warning" onClick={() => {
						handleCloseComment();
						setOpenCloseComment(false);
					}}>
						Close Comment
					</Button>
				}
			/>
			<DocumentReplyDialog
				open={openReply}
				onClose={handleCloseReply}
				commentId={row.id}
			/>
		</>
	)
}

export default ReportComments