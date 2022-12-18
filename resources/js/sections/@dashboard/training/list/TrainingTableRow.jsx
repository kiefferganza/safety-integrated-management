import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Button, TableRow, Checkbox, MenuItem, TableCell, IconButton, Divider } from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

TrainingTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onSelectRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	url: PropTypes.string
};

export default function TrainingTableRow ({ row, selected, onSelectRow, onDeleteRow, url }) {
	const { cms, title, traninees_count, training_date, date_expired, status, completed } = row;

	const [openConfirm, setOpenConfirm] = useState(false);

	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	return (
		<>
			<TableRow hover selected={selected}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell sx={{ textTransform: "uppercase" }}>{cms}</TableCell>

				<TableCell>{title}</TableCell>

				<TableCell align="center">{traninees_count}</TableCell>

				<TableCell>{fDate(training_date)}</TableCell>

				<TableCell>{fDate(date_expired)}</TableCell>

				<TableCell>
					<Label
						variant="soft"
						color={completed ? "success" : "warning"}
					>
						{completed ? "Complete" : "Incomplete"}
					</Label>
				</TableCell>

				<TableCell align="center">
					<Label
						variant="soft"
						color={status.color}
					>
						{status.text}
					</Label>
				</TableCell>

				<TableCell>
					<IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
				<MenuItem
					onClick={() => {
						handleClosePopover();
						Inertia.visit(`/dashboard/training/${url}/${row.id}`, {
							preserveScroll: true
						});
					}}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClosePopover();
						Inertia.visit(`/dashboard/training/${row.id}/edit`, {
							preserveScroll: true
						});
					}}
				>
					<Iconify icon="eva:edit-fill" />
					Edit
				</MenuItem>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<MenuItem
					onClick={() => {
						handleOpenConfirm();
						handleClosePopover();
					}}
					sx={{ color: 'error.main' }}
				>
					<Iconify icon="eva:trash-2-outline" />
					Delete
				</MenuItem>
			</MenuPopover>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={onDeleteRow}>
						Delete
					</Button>
				}
			/>
		</>
	);
}
