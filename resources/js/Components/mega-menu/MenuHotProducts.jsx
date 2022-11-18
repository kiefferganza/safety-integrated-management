import PropTypes from 'prop-types';
// @mui
import { Link as MuiLink, Typography, Box } from '@mui/material';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

MenuHotProducts.propTypes = {
	tags: PropTypes.array,
};

export default function MenuHotProducts ({ tags, ...other }) {
	return (
		<Box {...other}>
			<Typography variant="caption" fontWeight="fontWeightBold">
				Hot Products:
			</Typography>
			&nbsp;
			{tags.map((tag, index) => (
				<MuiLink
					href={tag.path}
					key={tag.name}
					component={Link} preserveScroll
					underline="none"
					variant="caption"
					sx={{
						color: 'text.secondary',
						transition: (theme) => theme.transitions.create('all'),
						'&:hover': { color: 'primary.main' },
					}}
				>
					{index === 0 ? tag.name : `, ${tag.name} `}
				</MuiLink>
			))}
		</Box>
	);
}
