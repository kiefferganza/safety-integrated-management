// @mui
import { Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// _mock_
import { _userCards } from '@/_mock/arrays';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
const { UserCard } = await import('@/sections/@dashboard/user/cards/UserCard');

// ----------------------------------------------------------------------

export default function UserCardsPage ({ users }) {
	const { themeStretch } = useSettingsContext();

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="User Cards"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{ name: 'User', href: PATH_DASHBOARD.user.root },
					{ name: 'Cards' },
				]}
			/>

			<Box
				gap={3}
				display="grid"
				gridTemplateColumns={{
					xs: 'repeat(1, 1fr)',
					sm: 'repeat(2, 1fr)',
					md: 'repeat(3, 1fr)',
				}}
			>
				{users.map((user) => (
					<UserCard key={user.user_id} user={user} />
				))}
			</Box>
		</Container>
	);
}
