import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
const { Button, CircularProgress, TableRow, MenuItem, TableCell, IconButton, Divider, Box, Dialog, DialogActions, Tooltip, useTheme } = await import('@mui/material');
// utils
import { fDate } from '@/utils/formatTime';
import { endOfMonth, startOfMonth } from 'date-fns';
// components
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { useDateRangePicker } from '@/Components/date-range-picker';
const { PDFViewer } = await import('@react-pdf/renderer');
import PpePDF from '../details/PpePDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link, usePage } from '@inertiajs/inertia-react';
import ReportTableSubRow from './ReportTableSubrow';
import { sentenceCase } from 'change-case';
import Label from '@/Components/label/Label';
import { PATH_DASHBOARD } from '@/routes/paths';

// ----------------------------------------------------------------------

ReportTableRow.propTypes = {
	row: PropTypes.object,
	onDeleteRow: PropTypes.func,
};

export default function ReportTableRow ({ row, onDeleteRow }) {
	const { auth: { user } } = usePage().props;

	const {
		form_number,
		contract_no,
		location,
		conducted_by,
		inventory_start_date,
		inventory_end_date,
		budget_forcast_date,
		submitted_date,
		submitted
	} = row;

	const { shortLabel } = useDateRangePicker(
		new Date(inventory_start_date),
		new Date(inventory_end_date)
	);

	const [openCollapse, setOpenCollapse] = useState(false);

	const [open, setOpen] = useState(false);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [openPopover, setOpenPopover] = useState(null);

	const handleOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	}

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

	const handleTriggerCollapse = () => {
		setOpenCollapse((currState) => !currState);
	}

	const getStatusColor = (status) => {
		let statusColor = "warning";
		switch (status) {
			case "for_review":
				statusColor = "warning";
				break;
			case "for_approval":
				statusColor = "info";
				break;
			case "approved":
			case "closed":
				statusColor = "success";
				break;
			case "fail":
				statusColor = "error";
				break;
			default:
				break;
		}
		return statusColor;
	}

	const forcastDate = new Date(budget_forcast_date);
	const forcastMonth = `${fDate(startOfMonth(forcastDate), 'dd')} - ${fDate(endOfMonth(forcastDate), 'dd MMM yyyy')}`;
	return (
		<>
			<TableRow hover>
				<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{form_number}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }} align="left">{contract_no}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }} align="left">{location}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }} align="left">{conducted_by}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{shortLabel}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{forcastMonth}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{fDate(submitted_date)}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{submitted?.fullname}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="center">
					<Label
						variant="soft"
						color={getStatusColor(row.status)}
						sx={{ textTransform: "capitalize" }}
					>
						{sentenceCase(row.status)}
					</Label>
				</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }} align="right">
					<IconButton
						aria-label="expand row"
						color={openCollapse ? 'inherit' : 'default'}
						onClick={handleTriggerCollapse}
					>
						<Iconify icon={openCollapse ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
					</IconButton>
					<IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<ReportTableSubRow row={row} open={openCollapse} />

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				<MenuItem
					component={Link}
					href={PATH_DASHBOARD.ppe.reportView(row.uuid)}
					preserveScroll
					onClick={handleClosePopover}
				>
					<Iconify icon="eva:eye-outline" />
					View
				</MenuItem>
				<MenuItem
					disabled={row.type !== "review"}
					component={Link}
					href={PATH_DASHBOARD.ppe.reportView(row.uuid)}
					preserveScroll
					onClick={handleClosePopover}
				>
					<Iconify width={16} icon="fontisto:preview" />
					Review
				</MenuItem>
				<MenuItem
					disabled={row.type !== "approve"}
					component={Link}
					href={PATH_DASHBOARD.ppe.reportView(row.uuid)}
					preserveScroll
					onClick={handleClosePopover}
				>
					<Iconify icon="pajamas:review-checkmark" />
					Verify
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={() => {
						handleOpen();
						handleClosePopover();
					}}
				>
					<Iconify icon="eva:eye-fill" />
					View Report
				</MenuItem>
				<PDFDownloadLink
					document={<PpePDF report={{ ...row, shortLabel }} title={form_number} />}
					fileName={form_number}
					style={{ textDecoration: 'none' }}
				>
					{({ loading }) => (
						<MenuItem
							onClick={() => {
								handleClosePopover();
							}}
						>
							{loading ? <CircularProgress size={18} color="inherit" sx={{ marginRight: 1.5 }} /> : <Iconify icon="eva:download-fill" />}
							Download
						</MenuItem>
					)}
				</PDFDownloadLink>
				{/* <MenuItem
					href={PATH_DASHBOARD.ppe.edit(slug)}
					component={Link}
					onClick={handleClosePopover}
				>
					<Iconify icon="eva:edit-fill" />
					Edit
				</MenuItem> */}
				<Divider />
				<MenuItem
					onClick={() => {
						handleOpenConfirm();
						handleClosePopover();
					}}
					sx={{ color: 'error.main' }}
					disabled={user?.emp_id !== submitted.employee_id}
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

			<Dialog fullScreen open={open}>
				<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					<DialogActions
						sx={{
							zIndex: 9,
							padding: '12px !important',
							boxShadow: (theme) => theme.customShadows.z8,
						}}
					>
						<Tooltip title="Close">
							<IconButton color="inherit" onClick={handleClose}>
								<Iconify icon="eva:close-fill" />
							</IconButton>
						</Tooltip>
					</DialogActions>

					<Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
						<PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
							<PpePDF report={{ ...row, shortLabel }} title={form_number} />
						</PDFViewer>
					</Box>
				</Box>
			</Dialog>
		</>
	);
}
