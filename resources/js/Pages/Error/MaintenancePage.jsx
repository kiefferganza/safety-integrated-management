import { Head, Link } from '@inertiajs/inertia-react';
// @mui
import { Button, Typography, Stack } from '@mui/material';
// assets
import { MaintenanceIllustration } from '@/assets/illustrations';
import CompactLayout from '@/Layouts/compact/CompactLayout';

// ----------------------------------------------------------------------

export default function MaintenancePage () {
	return (
		<>
			<Head>
				<title> Maintenance</title>
			</Head>

			<CompactLayout>
				<Stack sx={{ alignItems: 'center' }}>
					<Typography variant="h3" paragraph>
						Website currently under maintenance
					</Typography>

					<Typography sx={{ color: 'text.secondary' }}>
						We are currently working hard on this page!
					</Typography>

					<MaintenanceIllustration sx={{ my: 10, height: 240 }} />

					<Button href="/" component={Link} size="large" variant="contained">
						Go to Home
					</Button>
				</Stack>
			</CompactLayout>
		</>
	);
}
