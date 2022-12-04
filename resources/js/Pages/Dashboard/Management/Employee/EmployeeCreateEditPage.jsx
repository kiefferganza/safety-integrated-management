// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import EmpoloyeeNewEditForm from '@/sections/@dashboard/employee/form/EmpoloyeeNewEditForm';
import { Head } from '@inertiajs/inertia-react';
import { getCurrentUserName } from '@/utils/formatName';

// ----------------------------------------------------------------------

export default function EmployeeCreateEditPage ({ currentEmployee, companies, departments, positions, isEdit = false, users }) {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>{isEdit ? `${getCurrentUserName(currentEmployee)} - Edit` : "New employee"}</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading={isEdit ? "Edit employee" : "Create new employee"}
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
							name: isEdit ? getCurrentUserName(currentEmployee) : "New employee",
						},
					]}
				/>

				<EmpoloyeeNewEditForm
					currentEmployee={currentEmployee}
					companies={companies}
					departments={departments}
					positions={positions}
					users={users}
					isEdit={isEdit}
				/>
			</Container>
		</>
	);
}
