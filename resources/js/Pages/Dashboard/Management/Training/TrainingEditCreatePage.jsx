
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

// const TYPE_OPTIONS = [
// 	{ type: 2, label: 'Client' },
// 	{ type: 1, label: 'In-house' },
// 	{ type: 3, label: 'External' },
// 	{ type: 4, label: 'Induction' },
// ];

const TYPE_OPTIONS = {
	2: 'client',
	1: 'inHouse',
	3: 'thirdParty',
	4: 'induction'
}


export default function TrainingEditCreatePage ({ isEdit = false, details = null, currentTraining }) {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>{isEdit ? 'Update course' : 'New training'}</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading={isEdit ? 'Update course' : 'New training'}
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: details ? `${details?.title} List` : 'List',
							href: (isEdit && details) ? PATH_DASHBOARD.training[details?.url] : PATH_DASHBOARD.training.client,
						},
						{
							name: isEdit ? 'Update course' : 'New training',
						},
					]}
				/>

				<TrainingNewEditForm details={details} isEdit={isEdit} currentTraining={currentTraining} />
			</Container>
		</>
	);
}
