import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link as MuiLink } from '@mui/material';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const FavLogo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
	const theme = useTheme();

	// OR using local (public folder)
	// -------------------------------------------------------
	const logo = (
		<Box
			component="img"
			src="/storage/assets/favicon/logo.png"
			sx={{ width: 140, cursor: 'pointer', ...sx }}
		/>
	);

	if (disabledLink) {
		return <>{logo}</>;
	}

	return (
		<MuiLink href="/" component={Link} sx={{ display: 'contents' }}>
			{logo}
		</MuiLink>
	);
});

FavLogo.propTypes = {
	sx: PropTypes.object,
	disabledLink: PropTypes.bool,
};

export default FavLogo;
