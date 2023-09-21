import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, IconButton, MenuItem, Button, Divider } from '@mui/material';
// utils
import { bgBlur } from '@/utils/cssStyles';
// components
import Image from '@/Components/image';
import Iconify from '@/Components/iconify/Iconify';
import { ellipsis } from '@/utils/exercpt';
import MenuPopover from '@/Components/menu-popover/MenuPopover';
import ConfirmDialog from '@/Components/confirm-dialog/ConfirmDialog';

const GalleryItem = ({ image, onOpenLightbox, onDelete, canDelete, actionName, actionFn, queryKey, urlKey }) => {
	const theme = useTheme();
	const { medium, name, alt } = image;
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
			<Card sx={{ cursor: 'pointer', position: 'relative' }}>
				<Image alt={alt} ratio="1/1" src={medium} onClick={() => onOpenLightbox((image[urlKey] || medium))} />

				<Stack
					spacing={2}
					direction="row"
					alignItems="center"
					sx={{
						...bgBlur({
							color: theme.palette.grey[900],
						}),
						width: 1,
						left: 0,
						bottom: 0,
						position: 'absolute',
						color: 'common.white',
						p: (theme) => theme.spacing(3, 1, 3, 3),
					}}
				>
					<Stack flexGrow={1} spacing={1}>
						<Typography variant="subtitle1">{ellipsis(name, 16)}</Typography>
					</Stack>
					{canDelete && (
						<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
							<Iconify icon="eva:more-vertical-fill" />
						</IconButton>
					)}
				</Stack>
			</Card>
			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
				<MenuItem
					onClick={() => {
						actionFn(image.id);
						handleClosePopover();
					}}
				>
					<Iconify icon="eva:eye-fill" />
					{actionName}
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
					<Button variant="contained" color="error" onClick={() => {
						handleCloseConfirm();
						onDelete(image.id, queryKey)
					}}>
						Delete
					</Button>
				}
			/>
		</>
	);
}

export default GalleryItem;