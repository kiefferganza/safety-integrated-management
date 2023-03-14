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

// ----------------------------------------------------------------------

ReportTableRow.propTypes = {
	row: PropTypes.object,
	onDeleteRow: PropTypes.func,
};

export default function ReportTableRow ({ row, onDeleteRow }) {
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

	const forcastDate = new Date(budget_forcast_date);
	const forcastMonth = `${fDate(startOfMonth(forcastDate), 'dd')} - ${fDate(endOfMonth(forcastDate), 'dd MMM yyyy')}`;
	return (
		<>
			<TableRow hover>
				<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{form_number}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }} align="left">{contract_no}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }} align="left">{location}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }} align="left">{conducted_by}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{forcastMonth}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{shortLabel}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{fDate(submitted_date)}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }}>{submitted?.fullname}</TableCell>

				<TableCell sx={{ whiteSpace: "nowrap" }} align="right">
					<IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
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
							{loading ? <CircularProgress size={18} color="inherit" /> : <Iconify icon="eva:download-fill" />}
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
						// handleClosePopover();
					}}
					sx={{ color: 'error.main' }}
					disabled
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
