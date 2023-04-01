import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';
// @mui
import { Box, Card, Stack, Button, Divider, MenuItem, IconButton } from '@mui/material';
// hooks
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
// utils
import { fData } from '@/utils/formatNumber';
// components
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import TextMaxLine from '@/Components/text-max-line';
import { useSnackbar } from '@/Components/snackbar';
import ConfirmDialog from '@/Components/confirm-dialog';
//
import FileDetailsDrawer from '../portal/FileDetailsDrawer';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import usePermission from '@/hooks/usePermission';

// ----------------------------------------------------------------------

FileFolderCard.propTypes = {
	sx: PropTypes.object,
	folder: PropTypes.object,
};

export default function FileFolderCard ({ folder, onDelete, sx, ...other }) {
	const [hasPermission] = usePermission();
	const { load, stop } = useSwal();
	const { enqueueSnackbar } = useSnackbar();

	const { copy } = useCopyToClipboard();

	const [openConfirm, setOpenConfirm] = useState(false);

	const [openDetails, setOpenDetails] = useState(false);

	const [folderName, setFolderName] = useState(folder.name);

	const [openEditFolder, setOpenEditFolder] = useState(false);

	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleOpenDetails = (e) => {
		e.stopPropagation();
		setOpenDetails(true);
	};

	const handleCloseDetails = () => {
		setOpenDetails(false);
	};

	const handleOpenEditFolder = () => {
		setOpenEditFolder(true);
	};

	const handleCloseEditFolder = () => {
		setOpenEditFolder(false);
	};

	const handleOpenPopover = (event) => {
		event.stopPropagation();
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleCopy = () => {
		enqueueSnackbar('Copied!');
		copy(folder.url);
	};

	const handleUpdateFolder = () => {
		handleCloseEditFolder();
		Inertia.post(PATH_DASHBOARD.fileManager.edit(folder.id), { folderName }, {
			preserveScroll: true,
			onStart () {
				load(`Updating ${folder.name}.`, "Please wait...");
			},
			onFinish () {
				setFolderName(folderName);
				stop();
			}
		});
	}

	const canDelete = hasPermission("folder_delete");
	const canEdit = hasPermission("folder_edit");
	return (
		<>
			<Card
				sx={{
					p: 2.5,
					width: 1,
					maxWidth: 222,
					boxShadow: 0,
					bgcolor: 'background.default',
					border: (theme) => `solid 1px ${theme.palette.divider}`,
					...sx,
				}}
				{...other}
				onClick={handleOpenDetails}
			>
				<Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</Stack>

				<Box
					onClick={(e) => {
						e.stopPropagation();
						Inertia.visit(folder.url || PATH_DASHBOARD.fileManager.view(folder.id));
					}}
					component="img"
					src="/storage/assets/icons/files/ic_folder.svg"
					sx={{ width: 40, height: 40, cursor: 'pointer' }}
				/>

				<TextMaxLine asLink href={folder.url || PATH_DASHBOARD.fileManager.view(folder.id)} onClick={(e) => e.stopPropagation()} variant="h6" sx={{ mt: 1, mb: 0.5, cursor: 'pointer' }}>
					{folder.name}
				</TextMaxLine>

				<Stack
					direction="row"
					alignItems="center"
					spacing={0.75}
					sx={{ typography: 'caption', color: 'text.disabled' }}
				>
					<Box> {folder.size && fData(folder.size)} </Box>

					<Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

					<Box> {folder.totalFiles && `${folder.totalFiles} files`} </Box>

					<Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

					<Box>{folder.totalDocs && `${folder.totalDocs} docs`}</Box>
				</Stack>
			</Card>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				<MenuItem
					component={Link}
					href={folder.url || PATH_DASHBOARD.fileManager.view(folder.id)}
				>
					<Iconify icon="ic:outline-remove-red-eye" />
					Visit
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClosePopover();
						handleCopy();
					}}
				>
					<Iconify icon="eva:link-2-fill" />
					Copy Link
				</MenuItem>

				{canEdit && (
					<MenuItem
						onClick={() => {
							handleClosePopover();
							handleOpenEditFolder();
						}}
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

			<FileDetailsDrawer
				item={folder}
				onCopyLink={handleCopy}
				open={openDetails}
				onClose={handleCloseDetails}
				onDelete={() => {
					handleCloseDetails();
					onDelete();
				}}
			/>

			<FileNewFolderDialog
				open={openEditFolder}
				onClose={handleCloseEditFolder}
				title="Edit Folder"
				onUpdate={handleUpdateFolder}
				folderName={folderName}
				onChangeFolderName={(event) => setFolderName(event.target.value)}
			/>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={() => {
						handleCloseConfirm();
						onDelete();
					}}>
						Delete
					</Button>
				}
			/>
		</>
	);
}
