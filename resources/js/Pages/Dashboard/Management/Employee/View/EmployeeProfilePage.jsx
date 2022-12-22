import { useState, useEffect } from 'react';
import capitalize from 'lodash/capitalize';
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
	EmployeeProfile,
	ProfileCover,
	ProfileFriends,
	ProfileGallery,
} from '@/sections/@dashboard/user/profile';
import { getCurrentUserName } from '@/utils/formatName';
import EmployeeTrainings from '@/sections/@dashboard/user/profile/EmployeeTrainings';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getEmployees } from '@/redux/slices/employee';
import EmployeeFollowers from '@/sections/@dashboard/user/profile/EmployeeFollowers';

// ----------------------------------------------------------------------

export default function EmployeeProfilePage ({ employee }) {
	const dispatch = useDispatch();

	const { themeStretch } = useSettingsContext();

	const [searchFriends, setSearchFriends] = useState('');
	const [followers, setFollowers] = useState([]);

	const [currentTab, setCurrentTab] = useState('profile');

	const { employees, currentUser } = useSelector((state) => state.employee);

	useEffect(() => {
		if (employees.length === 0) {
			dispatch(getEmployees());
		}
		if (employees.length > 0 && employee?.followers?.length > 0) {
			const tmpFollowers = employee.followers.map((follower) => {
				const emp = employees.find(e => e.user_id === follower.user_id)
				if (emp) {
					return emp;
				}
			});
			setFollowers(tmpFollowers);
		}
	}, [dispatch]);

	const TABS = [
		{
			value: 'profile',
			label: 'Profile',
			icon: <Iconify icon="ic:round-account-box" />,
			component: <EmployeeProfile posts={_userFeeds} employee={employee} />,
		},
		{
			value: 'trainings',
			label: 'Trainings',
			icon: <Iconify icon="mingcute:certificate-2-fill" />,
			component: <EmployeeTrainings trainings={employee?.participated_trainings || []} />,
		},
		// {
		// 	value: 'followers',
		// 	label: 'Followers',
		// 	icon: <Iconify icon="eva:heart-fill" />,
		// 	component: <EmployeeFollowers followers={followers || []} currentUser={currentUser} />,
		// },
		// {
		// 	value: 'friends',
		// 	label: 'Friends',
		// 	icon: <Iconify icon="eva:people-fill" />,
		// 	component: (
		// 		<ProfileFriends
		// 			friends={[]}
		// 			searchFriends={searchFriends}
		// 			onSearchFriends={(event) => setSearchFriends(event.target.value)}
		// 		/>
		// 	),
		// },
		{
			value: 'gallery',
			label: 'Gallery',
			icon: <Iconify icon="ic:round-perm-media" />,
			component: <ProfileGallery gallery={_userGallery.slice(0, 3)} />,
		},
	];

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Profile"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{ name: 'Employees', href: PATH_DASHBOARD.employee.root },
					{ name: getCurrentUserName(employee) },
				]}
			/>
			<Card
				sx={{
					mb: 3,
					height: 280,
					position: 'relative',
				}}
			>
				<ProfileCover user={employee} name={getCurrentUserName(employee)} role={capitalize(employee?.position?.position || "")} cover="/storage/assets/images/home/cover.jpg" />

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
