import { useState } from 'react';
const { Box, Button, IconButton, TableCell, TableRow, Tooltip, MenuItem } = await import('@mui/material');
import Label from '@/Components/label/Label';
import Iconify from '@/Components/iconify/Iconify';
import ConfirmDialog from '@/Components/confirm-dialog/ConfirmDialog';
import MenuPopover from '@/Components/menu-popover';

const STATUSES = [
	{ label: "A. Approved", code: "A" },
	{ label: "B. SONO", code: "B" },
	{ label: "C. Fail / Not approved", code: "C" },
	{ label: "D. Approved with comments", code: "D" },
	{ label: "E. NOWC: No Objection with comments", code: "E" },
	{ label: "F. Responded / Reviewed / Actioned", code: "F" },
];

const DocumentExternalComment = ({ row, index, reviewer, commentStatus, onDelete, onAction, shareableLink }) => {
	const [openPopover, setOpenPopover] = useState(null);
	const [openDelete, setOpenDelete] = useState(false);

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleOpenDelete = () => {
		setOpenDelete(true);
	}

	const handleCloseDelete = () => {
		setOpenDelete(false);
	}

	const canDeleteComment = true;
	return (
		<>
			<TableRow
				sx={{
					borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
				}}
			>
				<TableCell>{index + 1}</TableCell>

				<TableCell align="left">{reviewer?.firstname} {reviewer?.lastname}</TableCell>

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
					<Label color={commentStatus.color}>
						{commentStatus.text}
					</Label>
				</TableCell>
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
			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
				{STATUSES.map(s => (
					<MenuItem
						key={s.code}
						onClick={() => {
							handleClosePopover();
							onAction({ status: s.code, responseId: row.response_id });
						}}
						sx={{ width: 1 }}
					>
						{s.label}
					</MenuItem>
				))}
			</MenuPopover>

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
		</>
	)
}

export default DocumentExternalComment