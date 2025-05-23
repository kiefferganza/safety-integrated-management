// @mui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Box, Link as MuiLink } from '@mui/material';
// config
import { HEADER } from '../../config';
// utils
import { bgBlur } from '@/utils/cssStyles';
// components
import Logo from '@/Components/logo';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

// Header.propTypes = {
// 	isOffset: PropTypes.bool,
// };

export default function Header ({ isOffset }) {
	const theme = useTheme();

	return (
		<AppBar color="transparent" sx={{ boxShadow: 0 }}>
			<Toolbar
				sx={{
					justifyContent: 'space-between',
					height: {
						xs: HEADER.H_MOBILE,
						md: HEADER.H_MAIN_DESKTOP,
					},
					transition: theme.transitions.create(['height', 'background-color'], {
						easing: theme.transitions.easing.easeInOut,
						duration: theme.transitions.duration.shorter,
					}),
					...(isOffset && {
						...bgBlur({ color: theme.palette.background.default }),
						height: {
							md: HEADER.H_MAIN_DESKTOP - 16,
						},
					}),
				}}
			>
				<Logo />

				<MuiLink href="/" component={Link} preserveScroll variant="subtitle2" color="inherit">
					Need Help?
				</MuiLink>
			</Toolbar>

			{isOffset && <Shadow />}
		</AppBar>
	);
}

// ----------------------------------------------------------------------

// Shadow.propTypes = {
// 	sx: PropTypes.object,
// };

function Shadow ({ sx, ...other }) {
	return (
		<Box
			sx={{
				left: 0,
				right: 0,
				bottom: 0,
				height: 24,
				zIndex: -1,
				m: 'auto',
				borderRadius: '50%',
				position: 'absolute',
				width: `calc(100% - 48px)`,
				boxShadow: (theme) => theme.customShadows.z8,
				...sx,
			}}
			{...other}
		/>
	);
}
