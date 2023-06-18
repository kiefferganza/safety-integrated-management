import { paramCase } from 'change-case';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import UserNewEditForm from '@/sections/@dashboard/user/UserNewEditForm';
import { getCurrentUserName } from '@/utils/formatName';

// ----------------------------------------------------------------------

export default function UserEditPage ({ user }) {
	const { themeStretch } = useSettingsContext();

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Edit user"
				links={[
					{
						name: 'Dashboard',
						href: PATH_DASHBOARD.root,
					},
					{
						name: 'User List',
						href: PATH_DASHBOARD.user.list,
					},
					{
						name: getCurrentUserName(user),
						href: route('management.user.show', user.username)
					},
					{
						name: "Edit"
					},
				]}
			/>

			<UserNewEditForm isEdit user={user} />
		</Container>
	);
}
