import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, } from '@inertiajs/inertia-react';
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
	Tooltip,
} from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import ReportDialog from '../details/ReportDialog';

// ----------------------------------------------------------------------

InspectionTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function InspectionTableRow ({ row, selected, onSelectRow, onDeleteRow }) {
	const [openDetail, setOpenDetail] = useState(false);
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

	const handleCLoseDetail = () => {
		setOpenDetail(false);
	}

	return (
		<>
			<TableRow hover selected={selected} sx={{ width: 1 }}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell align="left" sx={{ textTransform: 'capitalize', whiteSpace: "nowrap" }}>{row.form_number}</TableCell>

				<TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.accompanied_by}</TableCell>

				<TableCell align="center" sx={{ whiteSpace: "nowrap" }}>{row.inspected_by}</TableCell>

				<TableCell align="center" sx={{ whiteSpace: "nowrap" }}>{row.reviewer}</TableCell>

				<TableCell align="center" sx={{ whiteSpace: "nowrap" }}>{row.verifier}</TableCell>

				<TableCell align="center" sx={{ whiteSpace: "nowrap" }}>{fDate(row.date_issued)}</TableCell>

				<TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{row?.totalObservation}</TableCell>

				<TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{row?.negativeObservation}</TableCell>

				<TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{row?.positiveObservation}</TableCell>

				<TableCell align="center">
					<Stack direction="row" alignItems="center" gap={1}>
						<Tooltip title={row.status.tooltip}>
							<Label
								variant="soft"
								color={row.status.classType}
							>
								{row.status.text}
							</Label>
						</Tooltip>
						{(row.type !== "closeout" && row.status.text !== "C") && (
							<Tooltip title={row.dueStatus.tooltip}>
								<Label
									variant="soft"
									color={row.dueStatus.classType}
								>
									{row.dueStatus.text}
								</Label>
							</Tooltip>
						)}
					</Stack>
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
						setOpenDetail(true);
					}}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
				{row.type === "submitted" && (
					<MenuItem
						component={Link}
						href={PATH_DASHBOARD.inspection.edit(row.inspection_id)}
						preserveScroll
						onClick={handleClosePopover}
					>
						<Iconify icon="eva:edit-fill" />
						Edit
					</MenuItem>
				)}

				{row.type === "review" && (
					<MenuItem
						component={Link}
						href={PATH_DASHBOARD.inspection.review(row.inspection_id)}
						preserveScroll
						onClick={handleClosePopover}
					>
						<Iconify icon="fontisto:preview" />
						Review
					</MenuItem>
				)}

				{row.type === "verify" && (
					<MenuItem
						component={Link}
						href={PATH_DASHBOARD.inspection.verify(row.inspection_id)}
						preserveScroll
						onClick={handleClosePopover}
					>
						<Iconify icon="pajamas:review-checkmark" />
						Verify
					</MenuItem>
				)}


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
			<ReportDialog
				open={openDetail}
				onClose={handleCLoseDetail}
				inspection={row}
			/>
		</>
	);
}
