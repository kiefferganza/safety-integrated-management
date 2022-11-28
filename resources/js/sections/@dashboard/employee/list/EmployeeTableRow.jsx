import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
	Link,
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

EmployeeTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onEditRow: PropTypes.func,
	onViewRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function EmployeeTableRow ({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow, canWrite }) {
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
						<Avatar alt={row.name} src={row?.img_src ? `/storage/media/photos/employee/${row.img_src}` : null} />

						<Typography variant="subtitle2" noWrap>
							{row.name}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell align="left">{fDate(row.date_created)}</TableCell>

				<TableCell align="left">{row.position}</TableCell>

				<TableCell align="left">{row.department}</TableCell>

				<TableCell align="left">{row.nationality}</TableCell>

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

				<TableCell align="left">{row.phone_no}</TableCell>

				<TableCell align="right">
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				<MenuItem
					onClick={() => {
						onViewRow();
						handleClosePopover();
					}}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
				{canWrite && (
					<>
						<MenuItem
							onClick={() => {
								onEditRow();
								handleClosePopover();
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
