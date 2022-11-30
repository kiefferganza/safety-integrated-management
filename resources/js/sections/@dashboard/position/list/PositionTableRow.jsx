import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
	Button,
	Checkbox,
	TableRow,
	MenuItem,
	TableCell,
	IconButton,
} from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

PositionTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
};

export default function PositionTableRow ({ row, selected, onSelectRow, onDeleteRow }) {
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

				<TableCell align="left">{row.index}</TableCell>

				<TableCell align="center">{row.position}</TableCell>

				<TableCell align="center">{fDate(row.date_created)}</TableCell>

				<TableCell align="right">
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				<MenuItem
					onClick={() => {
						handleClosePopover();
						Inertia.visit(`/dashboard/employee/${row.id}`);
					}}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
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
