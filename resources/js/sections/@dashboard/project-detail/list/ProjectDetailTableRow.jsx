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
// components
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';

// ----------------------------------------------------------------------

ProjectDetailTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onUpdateRow: PropTypes.func,
};

export default function ProjectDetailTableRow ({ row, selected, onSelectRow, onDeleteRow, onUpdateRow }) {
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

				<TableCell align="left">{row.value}</TableCell>

				<TableCell align="left">{row.name}</TableCell>

				<TableCell align="left">{row.title}</TableCell>

				<TableCell align="right">
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				<MenuItem onClick={() => {
					onUpdateRow();
					handleClosePopover();
				}}>
					<Iconify icon="eva:edit-fill" />
					Edit
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
