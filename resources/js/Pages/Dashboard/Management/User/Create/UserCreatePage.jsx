
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import UserNewEditForm from '@/sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreatePage ({ employees }) {
	const { themeStretch } = useSettingsContext();

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Create a new user"
				links={[
					{
						name: 'Dashboard',
						href: PATH_DASHBOARD.root,
					},
					{
						name: 'User',
						href: PATH_DASHBOARD.user.list,
					},
					{ name: 'New user' },
				]}
			/>
			<UserNewEditForm employees={employees} />
		</Container>
	);
}
