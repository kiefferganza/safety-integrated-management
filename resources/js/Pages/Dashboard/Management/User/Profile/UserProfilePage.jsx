
import { useState } from 'react';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '@/_mock/arrays';
// components
import Iconify from '@/Components/iconify';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
// sections
import {
	Profile,
	ProfileCover,
	// ProfileFriends,
	ProfileGallery,
	// ProfileFollowers,
	EmployeeTrainings,
	ProfilePermissions
} from '@/sections/@dashboard/user/profile';
import { getCurrentUserName } from '@/utils/formatName';

// ----------------------------------------------------------------------

export default function UserProfilePage ({ user }) {
	const { themeStretch } = useSettingsContext();

	// const [searchFriends, setSearchFriends] = useState(''); 

	const [currentTab, setCurrentTab] = useState('profile');

	const TABS = [
		{
			value: 'profile',
			label: 'Profile',
			icon: <Iconify icon="ic:round-account-box" />,
			component: <Profile socialAccounts={user?.social_accounts || []} info={_userAbout} posts={_userFeeds} user={user} employee={user.employee} />,
		},
		{
			value: 'trainings',
			label: 'Trainings',
			icon: <Iconify icon="mingcute:certificate-2-fill" />,
			component: <EmployeeTrainings trainings={user.employee?.participated_trainings || []} />,
		},
		// {
		// 	value: 'followers',
		// 	label: 'Followers',
		// 	icon: <Iconify icon="eva:heart-fill" />,
		// 	component: <ProfileFollowers followers={_userFollowers} />,
		// },
		// {
		// 	value: 'friends',
		// 	label: 'Friends',
		// 	icon: <Iconify icon="eva:people-fill" />,
		// 	component: (
		// 		<ProfileFriends
		// 			friends={_userFriends}
		// 			searchFriends={searchFriends}
		// 			onSearchFriends={(event) => setSearchFriends(event.target.value)}
		// 		/>
		// 	),
		// },
		{
			value: 'gallery',
			label: 'Gallery',
			icon: <Iconify icon="ic:round-perm-media" />,
			component: <ProfileGallery user={user} />,
		},
	];

	if (!user?.roles.some((role) => role.name === 'Admin')) {
		TABS.push({
			value: 'permissions',
			label: 'Permissions',
			icon: <Iconify icon="fluent-mdl2:permissions-solid" />,
			component: <ProfilePermissions />,
		},);
	}

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Profile"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{ name: 'User', href: PATH_DASHBOARD.user.root },
					{ name: getCurrentUserName(user) },
				]}
			/>
			<Card
				sx={{
					mb: 3,
					height: 280,
					position: 'relative',
				}}
			>
				<ProfileCover user={user} name={getCurrentUserName(user)} role={user?.employee?.position?.position} />

				<Tabs
					value={currentTab}
					onChange={(event, newValue) => setCurrentTab(newValue)}
					sx={{
						width: 1,
						bottom: 0,
						zIndex: 9,
						position: 'absolute',
						bgcolor: 'background.paper',
						'& .MuiTabs-flexContainer': {
							pr: { md: 3 },
							justifyContent: {
								sm: 'center',
								md: 'flex-end',
							},
						},
					}}
				>
					{TABS.map((tab) => (
						<Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
					))}
				</Tabs>
			</Card>

			{TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>)}
		</Container>
	);
}
