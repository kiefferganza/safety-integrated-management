import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import Findings from '@/sections/@dashboard/inspection/details/Findings';
import { Container } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';

const index = ({ inspection }) => {
	const { themeStretch } = useSettingsContext();

	console.log(inspection);

	return (
		<DashboardLayout>
			<Head>
				<title>Unsatisfactory Items</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Edit Item"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'List',
							href: PATH_DASHBOARD.inspection.list,
						},
						{
							name: inspection?.form_number?.toUpperCase(),
						},
					]}
				/>

				<Findings inspection={inspection} />
			</Container>
		</DashboardLayout>
	)
}

export default index