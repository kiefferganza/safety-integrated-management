import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link as MuiLink } from '@mui/material';
//
import Image from '../image';
import TextMaxLine from '../text-max-line';
import Carousel, { CarouselDots, CarouselArrows } from '../carousel';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

MenuCarousel.propTypes = {
	sx: PropTypes.object,
	products: PropTypes.array,
	numberShow: PropTypes.number,
};

export default function MenuCarousel ({ products, numberShow, sx }) {
	const theme = useTheme();
	const carouselRef = useRef(null);

	const carouselSettings = {
		dots: true,
		arrows: false,
		slidesToShow: numberShow,
		slidesToScroll: numberShow,
		rtl: Boolean(theme.direction === 'rtl'),
		...CarouselDots(),
	};

	const handlePrev = () => {
		carouselRef.current?.slickPrev();
	};

	const handleNext = () => {
		carouselRef.current?.slickNext();
	};

	return (
		<Box sx={{ position: 'relative', ...sx }}>
			<CarouselArrows
				filled
				onNext={handleNext}
				onPrevious={handlePrev}
				leftButtonProps={{
					size: 'small',
					sx: { top: 56, left: -8 },
				}}
				rightButtonProps={{
					size: 'small',
					sx: { top: 56, right: -8 },
				}}
			>
				<Carousel ref={carouselRef} {...carouselSettings}>
					{products.map((product) => (
						<Box key={product.name} sx={{ px: 1, textAlign: 'center' }}>
							<MuiLink
								href={product.path}
								component={Link} preserveScroll
								color="inherit"
								underline="none"
								sx={{
									display: 'block',
									transition: (theme) => theme.transitions.create('all'),
									'&:hover': { color: 'primary.main' },
								}}
							>
								<Image
									alt={product.image}
									src={product.image}
									ratio="1/1"
									disabledEffect
									sx={{ borderRadius: 1, mb: 1 }}
								/>

								<TextMaxLine line={2} variant="caption" sx={{ fontWeight: 'fontWeightMedium' }}>
									{product.name}
								</TextMaxLine>
							</MuiLink>
						</Box>
					))}
				</Carousel>
			</CarouselArrows>
		</Box>
	);
}
