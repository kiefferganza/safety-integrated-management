import PropTypes from 'prop-types';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage, } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';
// @mui
import {
	// Link,
	Stack,
	Button,
	Divider,
	Checkbox,
	TableRow,
	MenuItem,
	TableCell,
	IconButton,
	Typography,
	Avatar,
} from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';

// ----------------------------------------------------------------------

InspectionTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function InspectionTableRow ({ row, selected, onSelectRow, onDeleteRow }) {
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
			<TableRow hover selected={selected} sx={{ width: 1 }}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell align="left" sx={{ textTransform: 'capitalize' }}>{row.form_number}</TableCell>

				<TableCell align="left">{row.accompanied_by}</TableCell>

				<TableCell align="left">{row.submitted}</TableCell>

				<TableCell align="left">{row.reviewer}</TableCell>

				<TableCell align="left">{row.verifier}</TableCell>

				<TableCell align="left">{fDate(row.date_issued)}</TableCell>

				<TableCell align="left">
					<Label
						variant="soft"
						color={row.status.classType}
					>
						{row.status.text}
					</Label>
				</TableCell>

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
						Inertia.visit(`/dashboard/employee/${row.id}`, {
							only: ['employee'],
							preserveScroll: true
						});
					}}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
				<MenuItem
					component={Link}
					href={PATH_DASHBOARD.employee.edit(row.employee_id)}
					preserveScroll
					onClick={handleClosePopover}
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
