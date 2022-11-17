
// @mui
import { Head } from '@inertiajs/inertia-react';
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '@/Components/settings';

// ----------------------------------------------------------------------
export default function BlankPage () {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title> Blank Page</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'xl'}>
				<Typography variant="h6"> Blank </Typography>
			</Container>
		</>
	);
}
