import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Avatar, Button, Checkbox, TableRow, MenuItem, TableCell, IconButton, Typography, Divider } from '@mui/material';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { fDate } from '@/utils/formatTime';
import { Link } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onEditRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function UserTableRow ({ row, selected, onSelectRow, onDeleteRow }) {
	const { username, name, profile, user_type, email, date_created, status } = row;

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

				<TableCell>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Avatar alt={name} src={profile ? profile.thumbnail : null} />

						<Typography variant="subtitle2" noWrap>
							{name}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell align="left">
					{email}
				</TableCell>

				<TableCell align="left">
					{fDate(date_created)}
				</TableCell>

				<TableCell align="left" sx={{ textTransform: 'capitalize' }}>
					{user_type === 0 ? "Admin" : "User"}
				</TableCell>

				<TableCell align="left">
					<Label
						variant="soft"
						color={(status === 0 && 'error') || 'success'}
					>
						{status === 1 ? "Active" : "Deactivated"}
					</Label>
				</TableCell>

				<TableCell align="right">
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
				<MenuItem component={Link} href={PATH_DASHBOARD.user.userProfile(username)}>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>

				<MenuItem component={Link} href={PATH_DASHBOARD.user.edit(username)}>
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
