
// @mui
import { Box } from '@mui/material';
//
import Footer from './Footer';
import Header from './Header';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function MainLayout ({ children }) {
	const { url } = usePage();

	const isHome = url === '/';

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
			<Header />

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					...(!isHome && {
						pt: { xs: 8, md: 11 },
					}),
				}}
			>
				{children}
			</Box>

			<Footer />
		</Box>
	);
}
