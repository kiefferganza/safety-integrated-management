import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Typography, Stack } from '@mui/material';
// utils
import { bgBlur } from '@/utils/cssStyles';
// components
import Image from '@/Components/image';
import Lightbox from '@/Components/lightbox';

// ----------------------------------------------------------------------

ProfileGallery.propTypes = {
	gallery: PropTypes.array,
};

export default function ProfileGallery ({ gallery }) {
	const [openLightbox, setOpenLightbox] = useState(false);

	const [selectedImage, setSelectedImage] = useState(0);

	const imagesLightbox = gallery.map((img) => img.url);

	const handleOpenLightbox = (url) => {
		const selectedImage = imagesLightbox.findIndex((index) => index === url);
		setOpenLightbox(true);
		setSelectedImage(selectedImage);
	};

	const handleCloseLightbox = () => {
		setOpenLightbox(false);
	}

	return (
		<>
			<Typography variant="h4" sx={{ my: 5 }}>
				Gallery
			</Typography>

			<Box
				gap={3}
				display="grid"
				gridTemplateColumns={{
					xs: 'repeat(1, 1fr)',
					sm: 'repeat(2, 1fr)',
					md: 'repeat(4, 1fr)',
				}}
			>
				{gallery.map((image) => (
					<GalleryItem key={image.id} image={image} onOpenLightbox={handleOpenLightbox} />
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
	);
}

// ----------------------------------------------------------------------

GalleryItem.propTypes = {
	onOpenLightbox: PropTypes.func,
	image: PropTypes.shape({
		url: PropTypes.string,
		name: PropTypes.string,
	}),
};

function GalleryItem ({ image, onOpenLightbox }) {
	const theme = useTheme();
	const { url, name } = image;

	return (
		<Card sx={{ cursor: 'pointer', position: 'relative' }}>
			<Image alt={name} ratio="1/1" src={url} onClick={() => onOpenLightbox(url)} />

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
					<Typography variant="subtitle1">{name}</Typography>
				</Stack>
			</Stack>
		</Card>
	);
}
