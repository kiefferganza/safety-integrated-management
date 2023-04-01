import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';
// @mui
const {
	Stack,
	Button,
	Divider,
	Checkbox,
	TableRow,
	MenuItem,
	TableCell,
	IconButton
} = await import('@mui/material');
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
const { DocumentTableSubRow } = await import('./DocumentTableSubRow');
const { DocumentFileList } = await import('../portal/DocumentFileList');
const { ConfirmDialog } = await import('@/Components/confirm-dialog/ConfirmDialog');

// ----------------------------------------------------------------------

DocumentTableRow.propTypes = {
	row: PropTypes.object,
	folder: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function DocumentTableRow ({ row, selected, onSelectRow, onDeleteRow, folder, canView }) {
	const [openCollapse, setOpenCollapse] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [openFileList, setOpenFileList] = useState(false);
	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleOpenFileList = () => {
		handleClosePopover();
		setOpenFileList(true);
	}

	const handleCloseFileList = () => {
		setOpenFileList(false);
	}

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleTriggerCollapse = () => {
		setOpenCollapse((currState) => !currState);
	}

	return (
		<>
			<TableRow hover selected={selected} sx={{ width: 1 }}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ textTransform: 'uppercase', whiteSpace: "nowrap" }}>{row.formNumber}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ textTransform: 'capitalize', whiteSpace: "nowrap" }}>{row.title}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ textTransform: 'capitalize', whiteSpace: "nowrap" }}>{row.description || "N/A"}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="center" sx={{ whiteSpace: "nowrap" }}>{row.rev || 0}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ whiteSpace: "nowrap" }}>{row.employee.fullname}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ whiteSpace: "nowrap" }}>{fDate(row.date_uploaded)}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="center">
					<Label
						variant="soft"
						color={row.docStatus.statusClass}
						sx={{ textTransform: "none" }}
					>
						{row.docStatus.statusText}
					</Label>
				</TableCell>

				<TableCell align="right">
					<Stack flexDirection="row">
						<IconButton
							aria-label="expand row"
							color={openCollapse ? 'inherit' : 'default'}
							onClick={handleTriggerCollapse}
						>
							<Iconify icon={openCollapse ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
						</IconButton>
						<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
							<Iconify icon="eva:more-vertical-fill" />
						</IconButton>
					</Stack>
				</TableCell>
			</TableRow>
			<DocumentTableSubRow row={row} open={openCollapse} />
			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				{canView && (
					<MenuItem
						component={Link}
						href={PATH_DASHBOARD.fileManager.viewDocument(folder.folder_id, row.id)}
						onClick={handleClosePopover}
					>
						<Iconify icon="eva:eye-fill" />
						View
					</MenuItem>
				)}
				<MenuItem
					onClick={handleOpenFileList}
				>
					<Iconify icon="heroicons:document-magnifying-glass-20-solid" />
					View Files
				</MenuItem>
				{row.docType === "submitted" && (
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
					<Button variant="contained" color="error" onClick={() => {
						onDeleteRow();
						handleCloseConfirm();
					}}>
						Delete
					</Button>
				}
			/>

			<DocumentFileList
				open={openFileList}
				onClose={handleCloseFileList}
				document={row}
				title={`${row.formNumber.toUpperCase()} File List`}
			/>

		</>
	);
}
