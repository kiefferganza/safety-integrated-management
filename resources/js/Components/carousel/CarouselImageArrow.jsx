import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// utils
import { bgGradient } from '@/utils/cssStyles';
// components
import Image from '@/Components/image';
import Lightbox from '@/Components/lightbox';
import Carousel, { CarouselArrowIndex } from '@/Components/carousel';

// ----------------------------------------------------------------------

const SPEED = 160;

const THUMB_SIZE = 64;

const StyledThumbnailsContainer = styled('div', {
	shouldForwardProp: (prop) => prop !== 'length',
})(({ length, theme }) => ({
	margin: theme.spacing(0, 'auto'),
	position: 'relative',

	'& .slick-slide': {
		opacity: 0.48,
		'&.slick-current': {
			opacity: 1,
		},
		'& > div': {
			padding: theme.spacing(0, 0.75),
		},
	},

	...(length === 1 && {
		maxWidth: THUMB_SIZE * 1 + 16,
	}),
	...(length === 2 && {
		maxWidth: THUMB_SIZE * 2 + 32,
	}),
	...((length === 3 || length === 4) && {
		maxWidth: THUMB_SIZE * 3 + 48,
	}),
	...(length >= 5 && {
		maxWidth: THUMB_SIZE * 6,
	}),
	...(length > 2 && {
		'&:before, &:after': {
			...bgGradient({
				direction: 'to left',
				startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
				endColor: `${theme.palette.background.default} 100%`,
			}),
			top: 0,
			zIndex: 9,
			content: "''",
			height: '100%',
			position: 'absolute',
			width: (THUMB_SIZE * 2) / 3,
		},
		'&:after': {
			right: 0,
			transform: 'scaleX(-1)',
		},
	}),
}));

// ----------------------------------------------------------------------

CarouselImageArrow.propTypes = {
	images: PropTypes.array,
};

export default function CarouselImageArrow ({ images = [] }) {
	const theme = useTheme();

	const carousel1 = useRef(null);

	const carousel2 = useRef(null);

	const [nav1, setNav1] = useState();

	const [nav2, setNav2] = useState();

	const [currentIndex, setCurrentIndex] = useState(0);

	const [openLightbox, setOpenLightbox] = useState(false);

	const [selectedImage, setSelectedImage] = useState(0);

	const imagesLightbox = images.map(img => img?.large || img?.medium || img.url);

	const handleOpenLightbox = (url) => {
		const selectedImageIdx = imagesLightbox.findIndex((img) => img === url);
		setOpenLightbox(true);
		setSelectedImage(selectedImageIdx);
	};

	const handleCloseLightbox = () => {
		setOpenLightbox(false);
	};

	const carouselSettings1 = {
		speed: SPEED,
		dots: false,
		arrows: false,
		slidesToShow: 1,
		draggable: false,
		slidesToScroll: 1,
		adaptiveHeight: true,
		beforeChange: (_current, next) => setCurrentIndex(next),
	};

	const carouselSettings2 = {
		speed: SPEED,
		dots: false,
		arrows: false,
		centerMode: true,
		swipeToSlide: true,
		focusOnSelect: true,
		variableWidth: true,
		centerPadding: '0px',
		slidesToShow: images.length > 3 ? 3 : images.length,
	};

	useEffect(() => {
		if (carousel1.current) {
			setNav1(carousel1.current);
		}
		if (carousel2.current) {
			setNav2(carousel2.current);
		}
	}, []);

	const handlePrev = () => {
		carousel2.current?.slickPrev();
	};

	const handleNext = () => {
		carousel2.current?.slickNext();
	};

	const renderLargeImg = (
		<Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
			<Carousel {...carouselSettings1} asNavFor={nav2} ref={carousel1}>
				{images.map((img) => (
					<Image
						key={img.id}
						alt="product"
						src={img?.medium || img?.url}
						ratio="1/1"
						onClick={() => handleOpenLightbox(img?.large || img?.medium || img.url)}
						sx={{ cursor: 'zoom-in' }}
					/>
				))}
			</Carousel>

			<CarouselArrowIndex
				index={currentIndex}
				total={images.length}
				onNext={handleNext}
				onPrevious={handlePrev}
			/>
		</Box>
	);

	const renderThumbnails = (
		<StyledThumbnailsContainer length={images.length}>
			<Carousel {...carouselSettings2} asNavFor={nav1} ref={carousel2}>
				{images.map((img, index) => (
					<Image
						key={img.id}
						disabledEffect
						alt={img.name}
						src={img?.large || img?.medium || img.url}
						sx={{
							width: THUMB_SIZE,
							height: THUMB_SIZE,
							borderRadius: 1.5,
							cursor: 'pointer',
							...(currentIndex === index && {
								border: (theme) => `solid 2px ${theme.palette.primary.main}`,
							}),
						}}
					/>
				))}
			</Carousel>
		</StyledThumbnailsContainer>
	);

	return (
		<>
			<Box
				sx={{
					'& .slick-slide': {
						float: theme.direction === 'rtl' ? 'right' : 'left',
					},
				}}
			>
				{renderLargeImg}

				{renderThumbnails}
			</Box>

			<Lightbox
				animationDuration={SPEED}
				images={imagesLightbox}
				mainSrc={imagesLightbox[selectedImage]}
				photoIndex={selectedImage}
				setPhotoIndex={setSelectedImage}
				open={openLightbox}
				onCloseRequest={handleCloseLightbox}
				onMovePrevRequest={() => {
					handlePrev();
					setSelectedImage((selectedImage + imagesLightbox.length - 1) % imagesLightbox.length);
				}}
				onMoveNextRequest={() => {
					handleNext();
					setSelectedImage((selectedImage + 1) % imagesLightbox.length);
				}}
			/>
		</>
	);
}
