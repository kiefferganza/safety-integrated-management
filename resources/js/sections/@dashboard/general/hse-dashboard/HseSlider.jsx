import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, CardContent, Typography } from '@mui/material';
// utils
import { bgGradient } from '@/utils/cssStyles';
// components
import Image from '@/Components/image';
import Carousel, { CarouselDots } from '@/Components/carousel';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
	// ...bgGradient({
	// 	startColor: `${alpha(theme.palette.common.black, 0)} 0%`,
	// 	endColor: `${theme.palette.common.black} 75%`,
	// }),
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	zIndex: 8,
	position: 'absolute',
}));

// ----------------------------------------------------------------------

HseSlider.propTypes = {
	list: PropTypes.array,
};

export default function HseSlider ({ list, ...other }) {
	const theme = useTheme();

	const carouselSettings = {
		speed: 1000,
		dots: true,
		arrows: false,
		autoplay: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		rtl: Boolean(theme.direction === 'rtl'),
		...CarouselDots({
			sx: {
				right: 24,
				bottom: 24,
				position: 'absolute',
			},
		}),
	};

	return (
		<Card {...other}>
			<Carousel {...carouselSettings}>
				{list.map((item) => (
					<CarouselItem key={item.id} item={item} />
				))}
			</Carousel>
		</Card>
	);
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
	item: PropTypes.object,
};

function CarouselItem ({ item }) {
	const { url, name } = item;

	return (
		<Box sx={{ position: 'relative' }}>
			<CardContent
				sx={{
					left: 0,
					bottom: 0,
					zIndex: 9,
					maxWidth: '80%',
					position: 'absolute',
					color: 'common.white',
				}}
			>

				{/* <Typography noWrap variant="h5" sx={{ mt: 1, mb: 3 }}>
					{name}
				</Typography> */}
			</CardContent>

			<StyledOverlay />

			<Image
				alt={name}
				src={url}
				sx={{
					height: { xs: 280, xl: 320 },
				}}
			/>
		</Box>
	);
}
