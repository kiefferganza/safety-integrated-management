
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import EmpoloyeeNewEditForm from '@/sections/@dashboard/employee/form';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function EmployeeCreatePage () {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Create a new employee</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Create a new invoice"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Employees',
							href: PATH_DASHBOARD.employee.root,
						},
						{
							name: 'New invoice',
						},
					]}
				/>

				<EmpoloyeeNewEditForm />
			</Container>
		</>
	);
}
