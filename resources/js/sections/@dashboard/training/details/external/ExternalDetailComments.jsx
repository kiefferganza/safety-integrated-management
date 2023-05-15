import { useState } from 'react';
const { Box, Button, IconButton, TableCell, TableRow, Tooltip, MenuItem } = await import('@mui/material');
import Label from '@/Components/label/Label';
import Iconify from '@/Components/iconify/Iconify';
import ConfirmDialog from '@/Components/confirm-dialog/ConfirmDialog';
const { ExternalReplyDialog } = await import('../../portal/ExternalReplyDialog');
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';

const ExternalDetailComments = ({ row, index, type, reviewer }) => {
	const { load, stop } = useSwal();
	const [openCloseComment, setOpenCloseComment] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openReply, setOpenReply] = useState(false);

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

	const handleCommentDelete = () => {
		Inertia.delete(route('training.management.external.external_comment_delete', row.id), {
			preserveScroll: true,
			onStart () {
				handleCloseDelete();
				load("Deleting comment", "please wait...");
			},
			onFinish () {
				stop();
			}
		})
	}

	const handleCloseComment = () => {
		Inertia.put(route('training.management.external.external_comment_status', row.id), {
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


	const canDeleteComment = type === "review" && !row?.reply_code;
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
							if (row.status === "closed" || type !== "review") return;
							setOpenCloseComment(true);
						}}
						sx={{
							cursor: row.status === "open" && type === "review" ? 'pointer' : 'default'
						}}
						color={(row.status === "open" && "success") || "error"}
						variant="filled"
					>
						{row.status}
					</Label>
				</TableCell>
				{(type === "action" && !row?.reply_code) && (
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
				{canDeleteComment && (
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
				content="Are you sure want to delete this comment?"
				action={
					<Button variant="contained" color="error" onClick={handleCommentDelete}>
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
					<Button variant="contained" color="warning" onClick={handleCloseComment}>
						Close Comment
					</Button>
				}
			/>
			<ExternalReplyDialog
				open={openReply}
				onClose={handleCloseReply}
				response_id={row.id}
			/>
		</>
	)
}

export default ExternalDetailComments