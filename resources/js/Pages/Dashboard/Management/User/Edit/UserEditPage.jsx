import { paramCase } from 'change-case';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// _mock_
import { _userList } from '@/_mock/arrays';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import UserNewEditForm from '@/sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage () {
	const { themeStretch } = useSettingsContext();

	// const { name } = useParams();

	const currentUser = _userList.find((user) => paramCase(user.name) === "reece-chung");

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
						name: 'User',
						href: PATH_DASHBOARD.user.list,
					},
					{ name: currentUser?.name },
				]}
			/>

			<UserNewEditForm isEdit currentUser={currentUser} />
		</Container>
	);
}
