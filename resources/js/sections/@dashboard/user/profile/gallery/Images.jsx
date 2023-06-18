import { useState } from 'react';
// @mui
import { Box, Typography, Stack } from '@mui/material';
import axiosInstance from '@/utils/axios';
// components
import Lightbox from '@/Components/lightbox';
// react query
import { useQuery } from "@tanstack/react-query";
import GalleryItem from './GalleryItem';
import GalleryLoad from './GalleryLoad';

const Images = ({ name, queryKey, params, title, onDelete, canDelete, actionName, actionFn }) => {
	const [currentPage] = useState(1);
	const [openLightbox, setOpenLightbox] = useState(false);
	const { data, isLoading, error } = useQuery({
		queryKey,
		queryFn: () => axiosInstance.get(route(name, {
			...params,
			_query: {
				page: currentPage
			}
		})),
		refetchOnWindowFocus: false,
	});

	const [selectedImage, setSelectedImage] = useState(0);

	const imagesLightbox = (data?.data?.data || []).map((img) => img.medium);

	const handleOpenLightbox = (url) => {
		const selectedImage = imagesLightbox.findIndex((index) => index === url);
		setOpenLightbox(true);
		setSelectedImage(selectedImage);
	};

	const handleCloseLightbox = () => {
		setOpenLightbox(false);
	}

	if (isLoading) {
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
					<GalleryLoad />
					<GalleryLoad />
					<GalleryLoad />
					<GalleryLoad />
					<GalleryLoad />
					<GalleryLoad />
					<GalleryLoad />
					<GalleryLoad />
				</Box>
			</>
		)
	}

	if (error) {
		return (
			<Typography variant="h4" sx={{ my: 5 }}>
				Something went wrong.
			</Typography>
		)
	}
	return (
		<Stack>
			<Typography variant="h4" sx={{ my: 5 }}>
				{title}
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
				{data?.data?.data?.map((image) => (
					<GalleryItem
						key={image.id}
						image={image}
						onOpenLightbox={handleOpenLightbox}
						onDelete={onDelete}
						canDelete={canDelete}
						actionName={actionName}
						actionFn={actionFn}
						queryKey={queryKey}
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
		</Stack>
	)
}

export default Images;
