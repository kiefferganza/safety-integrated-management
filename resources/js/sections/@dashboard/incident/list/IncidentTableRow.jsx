import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';
// @mui
const {
	// Link,
	Button,
	Divider,
	Checkbox,
	TableRow,
	MenuItem,
	TableCell,
	IconButton,
	Tooltip
} = await import('@mui/material');
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';

// ----------------------------------------------------------------------

IncidentTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export function IncidentTableRow ({ row, selected, onSelectRow, onDeleteRow }) {
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

				<Tooltip title={row.form_number}>
					<TableCell align="left" sx={{ textTransform: 'uppercase', whiteSpace: "nowrap", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis" }}>
						{row.form_number}
					</TableCell>
				</Tooltip>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.injured.fullname}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.site}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.location}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.engineer.fullname}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.firstAider.fullname}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{fDate(row.incident_date)}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>{row.lti}</TableCell>

				<TableCell align="center">
					<Label
						variant="soft"
						color={
							(row.severity === 'Fatality' && 'error') || (row.severity === 'Major' && 'warning') || (row.severity === 'Significant' && 'info') || 'success'
						}
					>
						{row.severity}
					</Label>
				</TableCell>

				<TableCell align="right">
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				{/* <MenuItem
					href={PATH_DASHBOARD.toolboxTalks.view(row.id)}
					component={Link}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem> */}

				<MenuItem
					href={PATH_DASHBOARD.incident.edit(row.uuid)}
					component={Link}
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
