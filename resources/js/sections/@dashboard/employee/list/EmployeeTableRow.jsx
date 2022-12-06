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
// import { useSelector, useDispatch } from 'react-redux';
// import { followUser } from '@/redux/slices/employee';

// ----------------------------------------------------------------------

EmployeeTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function EmployeeTableRow ({ row, selected, onSelectRow, onDeleteRow, onAssign, canWrite }) {
	// const dispatch = useDispatch();
	// const { isLoading } = useSelector(state => state.employee);
	// const { auth: { user } } = usePage().props;
	const [openConfirm, setOpenConfirm] = useState(false);

	const [loading, setLoading] = useState(false);
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

	// const handleFollowEmployee = () => {
	// 	setLoading(true);
	// 	handleClosePopover();
	// 	Inertia.post(`/dashboard/user/${row.user_id}/follow`, {}, {
	// 		preserveScroll: true,
	// 		preserveState: true,
	// 		onFinish () {
	// 			setLoading(false);
	// 		}
	// 	});
	// 	// dispatch(followUser(row.user_id));
	// }

	return (
		<>
			<TableRow hover selected={selected}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Avatar alt={row.name} src={row?.img_src ? `/storage/media/photos/employee/${row.img_src}` : null} />

						<Typography variant="subtitle2" noWrap>
							{row.name}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell align="left">{fDate(row.date_created)}</TableCell>

				<TableCell align="left">{row.position}</TableCell>

				<TableCell align="left">{row.department}</TableCell>

				<TableCell align="left">{row.country || "N/A"}</TableCell>

				<TableCell align="left">{row.phone_no}</TableCell>

				<TableCell align="left">
					<Label
						variant="soft"
						color={
							(row.status === 'active' && 'success') ||
							(row.status === 'inactive' && 'warning') ||
							'default'
						}
					>
						{row.status}
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
				{/* {row.user_id != user.user_id && (
					<MenuItem
						onClick={handleFollowEmployee}
						disabled={(row.user_id == 0) || loading}
					>
						<Iconify icon="eva:heart-fill" />
						<Iconify icon="eva:checkmark-fill" />
						Follow
					</MenuItem>
				)} */}
				{!row.user_id && (
					<MenuItem
						onClick={() => {
							handleClosePopover();
							onAssign(row);
						}}
					>
						<Iconify icon="mdi:account-arrow-right" />
						Assign User
					</MenuItem>
				)}
				{canWrite && (
					<>
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
