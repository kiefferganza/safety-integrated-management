import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';
import { Inertia } from '@inertiajs/inertia';
// @mui
import {
	Stack,
	Button,
	Divider,
	Checkbox,
	TableRow,
	MenuItem,
	TableCell,
	IconButton,
	Typography,
} from '@mui/material';
// hooks
import useDoubleClick from '@/hooks/useDoubleClick';
// utils
import { fDate } from '@/utils/formatTime';
import { fData } from '@/utils/formatNumber';
// components
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import FileThumbnail from '@/Components/file-thumbnail';
//
import FileDetailsDrawer from '../portal/FileDetailsDrawer';
import { FileNewFolderDialog } from '..';
import { useSwal } from '@/hooks/useSwal';
import usePermission from '@/hooks/usePermission';
import { Draggable } from 'react-beautiful-dnd';


// ----------------------------------------------------------------------

FileTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function FileTableRow ({ index, row, selected, onSelectRow, onDeleteRow }) {
	const [hasPermission] = usePermission();
	const { load, stop } = useSwal();
	const { id, name, size, type, dateCreated, totalDocs, totalFiles, revision_no, url } = row;

	const [folderName, setFolderName] = useState(name);

	const [openEditFolder, setOpenEditFolder] = useState(false);

	const [openDetails, setOpenDetails] = useState(false);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenEditFolder = () => {
		setOpenEditFolder(true);
	};

	const handleCloseEditFolder = () => {
		setOpenEditFolder(false);
	};

	const handleOpenDetails = () => {
		setOpenDetails(true);
	};

	const handleCloseDetails = () => {
		setOpenDetails(false);
	};

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

	const handleClick = useDoubleClick({
		click: () => {
			handleOpenDetails();
		},
		doubleClick: () => console.log('DOUBLE CLICK'),
	});

	const handleUpdateFolder = () => {
		handleCloseEditFolder();
		Inertia.post(PATH_DASHBOARD.fileManager.edit(id), { folderName }, {
			preserveScroll: true,
			onStart () {
				load(`Updating ${name}.`, "Please wait...");
			},
			onFinish () {
				setFolderName(folderName);
				stop();
			}
		});
	}

	const canDelete = hasPermission("folder_delete");
	const canEdit = hasPermission("folder_edit");
	// console.log(row);
	return (
		<>
			<Draggable isDragDisabled={row?.disableDrag} key={row.item_order.toString()} draggableId={row.item_order.toString()} index={index}>
				{(provided) => (
					<TableRow
						sx={{
							borderRadius: 1,
							'& .MuiTableCell-root': {
								bgcolor: 'background.default',
							},
							...(openDetails && {
								'& .MuiTableCell-root': {
									color: 'text.primary',
									typography: 'subtitle2',
									bgcolor: 'background.default',
								},
							}),
						}}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
					>
						<TableCell
							padding="checkbox"
							sx={{
								borderTopLeftRadius: 8,
								borderBottomLeftRadius: 8,
							}}
						>
							<Checkbox checked={selected} onDoubleClick={() => console.log('ON DOUBLE CLICK')} onClick={onSelectRow} />
						</TableCell>

						<TableCell onClick={handleClick}>
							<Stack direction="row" alignItems="center" spacing={2}>
								<FileThumbnail file={type} />

								<Typography noWrap variant="inherit" sx={{ maxWidth: 360, cursor: 'pointer' }}>
									{name}
								</Typography>
							</Stack>
						</TableCell>

						<TableCell align="left" onClick={handleClick} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
							{totalDocs && (totalDocs || 0).toLocaleString()}
						</TableCell>

						<TableCell align="left" onClick={handleClick} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
							{totalFiles && (totalFiles || 0).toLocaleString()}
						</TableCell>

						<TableCell align="left" onClick={handleClick} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
							{size && fData(size)}
						</TableCell>

						<TableCell align="left" onClick={handleClick} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
							{revision_no && revision_no}
						</TableCell>

						<TableCell align="left" onClick={handleClick} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
							{dateCreated && fDate(dateCreated)}
						</TableCell>

						<TableCell align="right">
							<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
								<Iconify icon="eva:more-vertical-fill" />
							</IconButton>
						</TableCell>
					</TableRow>
				)}
			</Draggable>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				<MenuItem
					component={Link}
					href={url || PATH_DASHBOARD.fileManager.view(id)}
				>
					<Iconify icon="ic:outline-remove-red-eye" />
					Visit
				</MenuItem>

				{canEdit && (
					<MenuItem
						onClick={() => {
							handleClosePopover();
							handleOpenEditFolder();
						}}
					>
						<Iconify icon="material-symbols:edit-outline-rounded" />
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

			<FileNewFolderDialog
				open={openEditFolder}
				onClose={handleCloseEditFolder}
				title="Edit Folder"
				onUpdate={handleUpdateFolder}
				folderName={folderName}
				onChangeFolderName={(event) => setFolderName(event.target.value)}
			/>

			<FileDetailsDrawer
				item={row}
				open={openDetails}
				onClose={handleCloseDetails}
				onDelete={onDeleteRow}
				canDelete={canDelete}
			/>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={() => {
						handleCloseConfirm();
						onDeleteRow();
					}}>
						Delete
					</Button>
				}
			/>

		</>
	);
}
