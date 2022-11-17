// @mui
import { usePage } from '@inertiajs/inertia-react';
import { Stack, Button, Typography, Box } from '@mui/material';
// locales
import { useLocales } from '../../../locales';

// ----------------------------------------------------------------------

export default function NavDocs () {
	const { auth: { user } } = usePage().props;

	const { translate } = useLocales();

	return (
		<Stack
			spacing={3}
			sx={{
				px: 5,
				pb: 5,
				mt: 10,
				width: 1,
				display: 'block',
				textAlign: 'center',
			}}
		>
			<Box component="img" src="/storage/assets/illustrations/illustration_docs.svg" />

			<div>
				<Typography gutterBottom variant="subtitle1">
					{translate('docs.hi')}, {user?.displayName}
				</Typography>

				<Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
					{translate('docs.description')}
				</Typography>
			</div>

			<Button href="/" target="_blank" rel="noopener" variant="contained">
				{translate('docs.documentation')}
			</Button>
		</Stack>
	);
}
