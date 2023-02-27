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
} = await import('@mui/material');
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';

// ----------------------------------------------------------------------

ToolboxTalkTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

const TYPES = {
	"0": 'All',
	"1": 'Civil',
	"2": 'Electrical',
	"3": 'Mechanical',
	"4": 'Camp',
	"5": 'Office',
};

export function ToolboxTalkTableRow ({ row, selected, onSelectRow, onDeleteRow, addTypeHeader = false }) {
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

				<TableCell align="left" sx={{ textTransform: 'uppercase', whiteSpace: "nowrap" }}>{row.cms}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.title}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.description}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.conducted?.fullname || row.conducted_by}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.location}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.participants_count}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{fDate(row.date_conducted)}</TableCell>

				<TableCell align="center" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>{row.attachment}</TableCell>

				{addTypeHeader && (
					<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{TYPES[row.tbt_type]}</TableCell>
				)}

				<TableCell align="left">
					<Label
						variant="soft"
						color={row.status.statusClass}
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
					href={PATH_DASHBOARD.toolboxTalks.view(row.id)}
					component={Link}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>

				<MenuItem
					href={PATH_DASHBOARD.toolboxTalks.edit(row.id)}
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
