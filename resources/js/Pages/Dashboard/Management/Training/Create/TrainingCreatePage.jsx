
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import TrainingNewEditForm from '@/sections/@dashboard/training/form';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function TrainingCreatePage () {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Create a new training</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Create a new training"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'List',
							href: PATH_DASHBOARD.training.client,
						},
						{
							name: 'New Training',
						},
					]}
				/>

				<TrainingNewEditForm />
			</Container>
		</>
	);
}
