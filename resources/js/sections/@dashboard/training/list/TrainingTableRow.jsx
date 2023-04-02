import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Button, TableRow, Checkbox, MenuItem, TableCell, IconButton, Divider } from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

TrainingTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onSelectRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	url: PropTypes.string
};

export default function TrainingTableRow ({ row, selected, onSelectRow, onDeleteRow, url, canEdit, canDelete }) {
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

				<TableCell sx={{ whiteSpace: "nowrap", textTransform: "uppercase" }}>{cms}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{title}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }} align="center">{traninees_count}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{fDate(training_date)}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{fDate(date_expired)}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>
					<Label
						variant="soft"
						color={completed ? "success" : "warning"}
					>
						{completed ? "Complete" : "Incomplete"}
					</Label>
				</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }} align="center">
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
					component={Link}
					href={`/dashboard/training/${url}/${row.id}`}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
				{canEdit && (
					<MenuItem
						component={Link}
						href={`/dashboard/training/${row.id}/edit`}
					>
						<Iconify icon="eva:edit-fill" />
						Edit
					</MenuItem>

				)}

				{canDelete && (
					<>
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
					</>
				)}
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
