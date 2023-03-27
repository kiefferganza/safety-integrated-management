import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, Stack, MenuItem, Button } from '@mui/material';
// utils
import { bgBlur } from '@/utils/cssStyles';
// components
import Image from '@/Components/image';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import Lightbox from '@/Components/lightbox';

const PublicImageList = ({ images = [] }) => {
	const { load, stop } = useSwal();
	const [openLightbox, setOpenLightbox] = useState(false);

	const [selectedImage, setSelectedImage] = useState(0);

	const imagesLightbox = images.map((img) => img.image.url);

	const handleOpenLightbox = (url) => {
		const selectedImage = imagesLightbox.findIndex((index) => index === url);
		setOpenLightbox(true);
		setSelectedImage(selectedImage);
	};

	const handleCloseLightbox = () => {
		setOpenLightbox(false);
	};

	const handleDeleteImage = (id) => {
		Inertia.delete(route('image.destroy', id), {
			preserveScroll: true,
			onStart () {
				load("Deleting image", 'please wait...');
			},
			onFinish () {
				stop();
			}
		});
	}

	return (
		<>
			<Typography variant="h4">
				Slider Images
			</Typography>

			<Box
				gap={3}
				display="grid"
				gridTemplateColumns={{
					xs: 'repeat(1, 1fr)',
					sm: 'repeat(2, 1fr)',
					md: 'repeat(3, 1fr)',
				}}
			>
				{images.map((image) => (
					<GalleryItem
						key={image.id}
						image={image.image}
						onOpenLightbox={handleOpenLightbox}
						onDeleteImage={() => handleDeleteImage(image.id)}
					/>
				))}
			</Box>

			<Lightbox
				images={imagesLightbox}
				mainSrc={imagesLightbox[selectedImage]}
				photoIndex={selectedImage}
				setPhotoIndex={setSelectedImage}
				open={openLightbox}
				onCloseRequest={handleCloseLightbox}
			/>
		</>
	)
}

function GalleryItem ({ image, onOpenLightbox, onDeleteImage }) {
	const theme = useTheme();
	const { url, name } = image;

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
				<Image alt="gallery" ratio="1/1" src={url} onClick={() => onOpenLightbox(url)} />

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
						p: (theme) => theme.spacing(1.5, 1, 1.5, 1.5),
					}}
				>
					<Stack flexGrow={1} spacing={1}>
						<Typography variant="subtitle1">{name}</Typography>
					</Stack>

					<IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</Stack>
			</Card>
			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="top-right" sx={{ width: 140 }}>
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
					<Button variant="contained" color="error" onClick={onDeleteImage}>
						Delete
					</Button>
				}
			/>
		</>
	);
}


export default PublicImageList